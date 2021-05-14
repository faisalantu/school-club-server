const express = require("express");
const router = express.Router();
const PostModel = require("../models/Post");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const { cloudinary } = require("../utils/cloudinary");
const mongoose = require("mongoose");

// @route   GET api/posts
// @desc    get all posts
// @access  Public
// @query   categody,club,skip,limit
router.get("/", async (req, res) => {
  try {
    let { category, club, skip, limit } = req.query;
    skip = Number(skip);
    limit = Number(limit);
    function matchQuery() {
      if (category && club) {
        return {
          "clublist.slug": req.query.club,
          category: req.query.category,
        };
      } else if (category) {
        return {
          category: req.query.category,
        };
      } else if (club) {
        return {
          "clublist.slug": req.query.club,
        };
      } else {
        return {};
      }
    }
    const posts = await PostModel.aggregate()
      .lookup({
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userlist",
      })
      .lookup({
        from: "clublists",
        localField: "clubId",
        foreignField: "_id",
        as: "clublist",
      })
      .match(matchQuery())
      .project({
        "userlist.password": 0,
        "userlist.email": 0,
        clubId: 0,
        userId: 0,
      })
      // .project({
      //   "clublist.slug": 1,
      //   category: 1,
      // })
      .skip(skip ? skip : 0)
      .limit(limit ? limit : 20);

    res.status(200).send(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ success: false, masssage: "no posts" });
  }
});

// @route   GET api/post/one
// @desc    get all post/one
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
    const posts = await PostModel.aggregate()
      .lookup({
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userlist",
      })
      .lookup({
        from: "clublists",
        localField: "clubId",
        foreignField: "_id",
        as: "clublist",
      })
      .match(matchQuery())
      .project({
        "userlist.password": 0,
        "userlist.email": 0,
        clubId: 0,
        userId: 0,
      })
      .limit(1);
    res.status(200).send(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ success: false, masssage: "no posts" });
  }
});
// @route   GET api/post/user
// @desc    get all user post
// @access  private
router.get("/user", auth, async (req, res) => {
  console.log(req.user.id);
  let userId = mongoose.Types.ObjectId(req.user.id);
  try {
    const posts = await PostModel.aggregate()
      .lookup({
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userlist",
      })
      .match({ "userlist._id": userId })
      .project({
        "userlist.password": 0,
        "userlist.email": 0,
        clubId: 0,
        userId: 0,
      })
      .limit(20);
    res.status(200).send(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ success: false, masssage: "no posts" });
  }
});

// @route   POST api/posts
// @desc    single POST request
// @access  Private
router.post(
  "/",
  auth,
  [
    check("title", "Please add title").not().isEmpty(),
    check("imageObj", "Please include an image").not().isEmpty(),
    check("eventBody", "Please write someting about the event").not().isEmpty(),
    check("tags", "insert some tags").isArray(),
    check("isPublic", "Please include post visibility")
      .not()
      .isEmpty()
      .isBoolean(),
    check("anonymous", "anyomous should be boolean").isBoolean(),
    check("category", "post must have a category").not().isEmpty().isString(),
    check("clubId", "clubId should be string").not().isEmpty().isString(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      try {
        const fileStr = req.body.imageObj;
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
          upload_preset: "posts",
        });
        let post = new PostModel({
          title: req.body.title,
          imageObj: uploadResponse,
          eventBody: req.body.eventBody,
          tags: req.body.tags,
          isPublic: req.body.isPublic,
          anonymous: req.body.anonymous,
          category: req.body.category,
          userId: req.user.id,
          clubId: req.body.clubId,
        });

        try {
          post = await post.save();
          res.send({ success: true, message: "post added " });
        } catch (err) {
          res
            .status(500)
            .send({ success: false, message: "post cannot be created" });
        }
      } catch (err) {
        res
          .status(500)
          .send({ success: false, message: "image upload failed" });
      }
    }
  }
);

// @route   PUT api/posts
// @desc    get all posts
// @access  Private
router.put("/", (req, res) => {
  res.send("PUT api/posts");
});

// @route   DELETE api/posts
// @desc    get all posts
// @access  Private
router.delete("/", (req, res) => {
  res.send("DELETE api/posts");
});

module.exports = router;
