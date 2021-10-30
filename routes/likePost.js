const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const PostLike = require("../models/PostLike");
const auth = require("../middleware/adminAuth");
const { check, body, validationResult } = require("express-validator");

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

  [
    check("postId").custom((value) => {
      if (!mongoose.isValidObjectId(value)) {
        throw new Error("post id not valid");
      }
      return true;
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      res.send({ success: true, message: "success :)" });
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
