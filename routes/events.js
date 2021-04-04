const express = require("express");
const router = express.Router();

const { check, validationResult } = require("express-validator");

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
router.post(
  "/",
  [
    check("title", "Please add title").not().isEmpty(),
    check("location", "Please add a location").not().isEmpty(),
    check("fee", "Please add a fee").not().isEmpty().isNumeric(),
    check("tickets", "Please add number of tickets")
      .not()
      .isEmpty()
      .isNumeric(),
    check("eventTime", "Please add event time").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("phoneNumber", "Please include a phone number").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      const { title, location, fee, tickets, eventTime, email, phoneNumber } = req.body;
      res.send(errors);
    }
  }
);

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
