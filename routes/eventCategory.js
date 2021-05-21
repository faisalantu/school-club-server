const express = require("express");
const router = express.Router();
const EventCategory = require('../models/EventCategory')
const auth = require("../middleware/auth");

// @route   GET api/eventcategory
// @desc    get all eventcategory
// @access  Public
router.get("/", async (req, res) => {
    const eventCategory = await EventCategory.find();
    if (eventCategory) {
      res.status(200).send(eventCategory);
    }
    else {
      res.status(400).send({ success: false, masssage: "EventCategory not found" });
    }
  
  }); 


module.exports = router;
