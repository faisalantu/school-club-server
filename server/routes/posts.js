const express = require("express");
const router = express.Router();

// @route   GET api/posts
// @desc    get all posts
// @access  Public
router.get("/", async (req, res) => {
  res.json({
    msg: "GET api/post",
  });
});

// @route   POST api/posts
// @desc    get all posts
// @access  Private
router.post("/",async (req, res) => {
  res.json({
    msg: "POST api/posts",
  });
});

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
