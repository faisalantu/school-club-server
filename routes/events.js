const express = require("express");
const router = express.Router();

// @route   GET api/events
// @desc    get all events
// @access  Public
router.get("/", async (req, res) => {
  res.json({
    msg: "GET api/event",
  });
});

// @route   POST api/events
// @desc    get all events
// @access  Private
router.post("/",async (req, res) => {
  res.json({
    msg: "POST api/events",
  });
});

// @route   PUT api/events
// @desc    get all events
// @access  Private
router.put("/", (req, res) => {
  res.send("PUT api/events");
});

// @route   DELETE api/events
// @desc    get all events
// @access  Private
router.delete("/", (req, res) => {
  res.send("DELETE api/events");
});

module.exports = router;
