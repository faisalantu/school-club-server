const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const PostLikeModel = require("../models/PostLike");
const PostModel = require("../models/Post");
const auth = require("../middleware/adminAuth");
const { check, body, validationResult } = require("express-validator");
const c = require("config");

// @route   GET api/role
// @desc    get all role
// @access  Public
router.get("/", auth, async (req, res) => {
  res.send({ success: true, message: "success :)" });
});

// @route   POST api/role
// @desc    get all role
// @access  Private
router.post(
  "/",
  auth,

  [
    check("postId").custom((value) => {
      if (!mongoose.isValidObjectId(value)) {
        throw new Error("post id not valid");
      }
      return true;
    }),
    check("isActive", "someting went wrong").not().isEmpty().isBoolean(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      try {
        const postData = await PostModel.findById(req.body.postId);
        if (postData) {
          if (req.body.isActive) {
            const checkExistingLike = await PostLikeModel.findOne({
              uid: req.user.id,
              postId: req.body.postId,
            });
            if (!checkExistingLike) {
              let like = new PostLikeModel({
                uid: req.user.id,
                postId: req.body.postId,
              });
              let saveLike = await like.save();
              res.send({ success: true, message: "success like" });
            } else {
              res.send({ success: true, message: "already liked the post" });
            }
          } else {
            const deleteLike = await PostLikeModel.findOneAndDelete({
              uid: req.user.id,
              postId: req.body.postId,
            });
            if (deleteLike) {
              res.send({ success: true, message: "success unliked" });
            } else {
              res.send({
                success: false,
                message: "already unliked the post",
              });
            }
          }
        } else {
          res.send({ success: false, message: "no post with that id" });
        }
      } catch (err) {
        res.send({ success: false, message: "error fetching post data" });
      }
    }
  }
);

// @route   DELETE api/role
// @desc    get all role
// @access  Private
router.delete("/:ID", auth, async (req, res) => {
  res.send({ success: true, message: "success :)" });
});

module.exports = router;
