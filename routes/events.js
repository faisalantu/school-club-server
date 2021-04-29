const express = require("express");
const router = express.Router();
const Event = require('../models/Event')
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const { cloudinary } = require('../utils/cloudinary');

// @route   GET api/events
// @desc    get all events
// @access  Public
router.get("/", async (req, res) => {

  const evevt = await Event.find().sort({ '_id': -1 });
  if (evevt) {
    res.status(200).send(evevt);
  }
  else {
    res.status(400).send({ success: false, masssage: "events not found" });
  }

});

// @route   GET api/events
// @desc    get one events
// @access  Public
router.get("/:id", async (req, res) => {

  const evevt = await Event.findById(req.params.id);
  if (evevt) {
    res.status(200).send(evevt);
  }
  else {
    res.status(400).send({ masssage: "event not found" });
  }

});

// @route   POST api/events
// @desc    add event
// @access  Private
router.post("/",
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
    check("imageUrl", "Please include an image").not().isEmpty(),
    check("eventBody", "Please write someting about the event").not().isEmpty(),
    check("isPublic", "Please include a phone number").not().isEmpty().isBoolean(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      try {
        const fileStr = req.body.data;
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            upload_preset: 'events',
        });
        console.log(uploadResponse);
        res.json({ msg: 'yaya' });
      } catch (err) {
        
      }

      // let event = new Event({
      //   title: req.body.title,
      //   location: req.body.location,
      //   tickets: req.body.tickets,
      //   fee: req.body.fee,
      //   eventTime: req.body.time,
      //   email: req.body.email,
      //   contactNumber: req.body.contactNumber,
      //   isPublic: req.body.isPublic,
      //   userId: req.user.id,

      // });
      // event = await event.save();
      // if (!event) {
      //   res.status(500).send({ success: false , message: 'The event cannot be created'  })
      // }
      // res.send( { success: true ,message:"Event added "  });
    }
  }
);

// @route   PUT api/events
// @desc    update single events
// @access  Private
router.put("/:id", auth, [
  check("title", "Please add title").not().isEmpty(),
  check("location", "Please add a location").not().isEmpty(),
  check("fee", "Please add a fee").not().isEmpty().isNumeric(),
  check("tickets", "Please add number of tickets")
    .not()
    .isEmpty()
    .isNumeric(),
  check("eventTime", "Please add event time").not().isEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check("contactNumber", "Please include a phone number").not().isEmpty(),
  check("isPublic", "Please include a phone number").not().isEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  }
  const event = await Event.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      location: req.body.location,
      tickets: req.body.tickets,
      fee: req.body.fee,
      time: req.body.time,
      email: req.body.email,
      contactNumber: req.body.contactNumber,
      isPublic: req.body.isPublic,
      userId: req.user.id,
    },

  )

  if (!event) {
    return res.status(500).send('the event cannot be updated!')
  }
  res.status(200).json({ success: true, message: 'the Event is updated!' })
});

// @route   DELETE api/events
// @desc    DELETE events
// @access  Private
router.delete("/:id", auth, (req, res) => {

  Event.findByIdAndRemove(req.params.id).then(Event => {
    if (Event) {
      return res.status(200).json({ success: true, message: 'the Event is deleted!' })
    } else {
      return res.status(404).json({ success: false, message: "Event not found!" })
    }
  }).catch(err => {
    return res.status(500).json({ success: false, error: err ,message: "could not be deleted"  })
  })


});

module.exports = router;
