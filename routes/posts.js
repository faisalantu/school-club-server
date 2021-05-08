const express = require("express");
const router = express.Router();
const PostModel = require("../models/Post");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const { cloudinary } = require("../utils/cloudinary");
// @route   GET api/posts
// @desc    get all posts
// @access  Public
router.get("/", async (req, res) => {
  try {
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
      .project({
        "userlist.password": 0,
        "userlist.email": 0,
        clubId:0,
        userId:0,
      });
    res.status(200).send(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ success: false, masssage: "no posts" });
  }
});

// @route   POST api/posts
// @desc    get all posts
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
