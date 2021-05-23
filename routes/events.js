const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const checkPrecedent = require("../middleware/checkPrecedent");
const { check, validationResult } = require("express-validator");
const { cloudinary } = require("../utils/cloudinary");

// @route   GET api/events
// @desc    get all events
// @access  Public
// @query   category,club,skip,limit => category ment eventType
router.get("/", async (req, res) => {
  try {
    let { category, club, skip, limit } = req.query;
    skip = Number(skip);
    limit = Number(limit);
    function matchQuery() {
      if (category && club) {
        return {
          "clublist.slug": req.query.club,
          "eventCategory.slug": req.query.category,
        };
      } else if (category) {
        return {
          "eventCategory.slug": req.query.category,
        };
      } else if (club) {
        return {
          "clublist.slug": req.query.club,
        };
      } else {
        return {};
      }
    }
    const events = await Event.aggregate()

      .lookup({
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userlist",
      })
      .unwind("userlist")
      .lookup({
        from: "clublists",
        localField: "clubId",
        foreignField: "_id",
        as: "clublist",
      })
      .unwind("clublist")
      .lookup({
        from: "eventcategories",
        localField: "eventType",
        foreignField: "_id",
        as: "eventCategory",
      })
      .unwind("eventCategory")
      .match(matchQuery())
      .project({
        "userlist.password": 0,
        "userlist.email": 0,
        clubId: 0,
        userId: 0,
      })
      // .project({
      //   "clublist.slug": 1,
      //   eventCategory: 1,
      // })
      .skip(skip ? skip : 0)
      .limit(limit ? limit : 20);

    res.status(200).send(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ success: false, masssage: "no events" });
  }
});

// @route   GET api/events/one
// @desc    get all events/one
// @access  Public
router.get("/one", async (req, res) => {
  try {
    let { slug, postId } = req.query;
    let postObjId = mongoose.Types.ObjectId(postId);
    function matchQuery() {
      if (slug) {
        return {
          slug: slug,
        };
      } else if (postId) {
        return {
          _id: postObjId,
        };
      } else {
      }
    }
    const events = await Event.aggregate()
      .lookup({
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userlist",
      })
      .unwind("userlist")
      .lookup({
        from: "clublists",
        localField: "clubId",
        foreignField: "_id",
        as: "clublist",
      })
      .unwind("clublist")
      .match(matchQuery())
      .project({
        "userlist.password": 0,
        "userlist.email": 0,
        clubId: 0,
        userId: 0,
      })
      .limit(1);
    res.status(200).send(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ success: false, masssage: "no event" });
  }
});

// @route   GET api/events/user
// @desc    get all events from single user
// @access  private
router.get("/user", auth, async (req, res) => {
  let userId = mongoose.Types.ObjectId(req.user.id);
  let { skip, limit } = req.query;
  skip = Number(skip);
  limit = Number(limit);
  try {
    const events = await Event.aggregate()
      .lookup({
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userlist",
      })
      .unwind("userlist")
      .match({ "userlist._id": userId })
      .project({
        "userlist.password": 0,
        "userlist.email": 0,
        clubId: 0,
        userId: 0,
      })
      .skip(skip ? skip : 0)
      .limit(limit ? limit : 20);
    res.status(200).send(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ success: false, masssage: "no events" });
  }
});

// @route   POST api/events
// @desc    add event
// @access  Private
router.post(
  "/",
  auth,
  checkPrecedent,
  [
    check("title", "Please add title").not().isEmpty(),
    check("location", "Please add a location").not().isEmpty(),
    check("fee", "Please add a fee").not().isEmpty().isNumeric(),
    check("tickets", "Please add number of tickets")
      .not()
      .isEmpty()
      .isNumeric(),
    check("startTime", "Please add event starting time").not().isEmpty(),
    check("endTime", "Please add event ending time").not().isEmpty(),
    check("eventDate", "Please add event date").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("contactNumber", "Please include a phone number").not().isEmpty(),
    check("imageObj", "Please include an image").not().isEmpty(),
    check("eventType", "eventType should be a string")
      .not()
      .isEmpty()
      .isString(),
    check("eventBody", "Please write someting about the event").not().isEmpty(),
    check("isPublic", "Please include a phone number")
      .not()
      .isEmpty()
      .isBoolean(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      try {
        const fileStr = req.body.imageObj;
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
          upload_preset: "events",
        });
        let event = new Event({
          title: req.body.title,
          location: req.body.location,
          tickets: req.body.tickets,
          fee: req.body.fee,
          startTime: req.body.startTime,
          endTime: req.body.endTime,
          eventDate: req.body.eventDate,
          email: req.body.email,
          contactNumber: req.body.contactNumber,
          imageObj: uploadResponse,
          eventBody: req.body.eventBody,
          isPublic: req.body.isPublic,
          userId: req.user.id,
          eventType: req.body.eventType,
          clubId: req.presidentOf,
        });

        try {
          event = await event.save();
          res.send({ success: true, message: "Event added " });
        } catch (err) {
          res
            .status(500)
            .send({ success: false, message: "The event cannot be created" });
        }
      } catch (err) {
        res
          .status(500)
          .send({ success: false, message: "The event cannot be created" });
      }
    }
  }
);

// @route   DELETE api/events/one
// @desc    delete one event
// @access  Private
router.delete("/one", auth, checkPrecedent, async (req, res) => {
  let { postId } = req.query;
  //check post by id
  const post = await Event.deleteOne({ _id: postId });
  res.send(post);
});

module.exports = router;
