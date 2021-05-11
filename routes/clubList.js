const express = require("express");
const router = express.Router();
const ClubList = require('../models/ClubList')
const auth = require("../middleware/auth");

// @route   GET api/clublist
// @desc    get all clublist
// @access  Public
router.get("/", async (req, res) => {
    const club = await ClubList.find();
    if (club) {
      res.status(200).send(club);
    }
    else {
      res.status(400).send({ success: false, masssage: "clubs not found" });
    }
  
  });

// @route   POST api/clublist
// @desc    get all clublist
// @access  Private
router.post("/",auth,async (req, res) => {

    let club = new ClubList({
        name: req.body.name,

      });
      club = await club.save();
      if (!club) {
        res.status(500).send({ success: false , message: 'The club cannot be created'  })
      }
      res.send( { success: true ,message:"club added "  });
});

// @route   PUT api/clublist
// @desc    get all clublist
// @access  Private
router.put("/", (req, res) => {
  res.send("PUT api/clublist");
});

// @route   DELETE api/clublist
// @desc    get all clublist
// @access  Private
router.delete("/", (req, res) => {
  res.send("DELETE api/clublist");
});

module.exports = router;
