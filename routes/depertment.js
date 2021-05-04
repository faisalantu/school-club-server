const express = require("express");
const router = express.Router();
const Depertment = require('../models/Depertment')
const auth = require("../middleware/auth");

// @route   GET api/posts
// @desc    get all posts
// @access  Public
router.get("/", async (req, res) => {
    const depertment = await Depertment.find();
    if (depertment) {
      res.status(200).send(depertment);
    }
    else {
      res.status(400).send({ success: false, masssage: "Depertment not found" });
    }
  
  }); 

// @route   POST api/posts
// @desc    get all posts
// @access  Private
router.post("/",auth,async (req, res) => {

    let depertment = new Depertment({
        name: req.body.name,
        fullName:req.body.fullName,
        intersted:req.body.intersted
      });
      depertment = await depertment.save();
      if (!depertment) {
        res.status(500).send({ success: false , message: 'The depertment cannot be created'  })
      }
      res.send( { success: true ,message:"depertment added "  });
});

// @route   PUT api/posts
// @desc    get all posts
// @access  Private
router.put("/", (req, res) => {
  res.send("PUT api/clublist");
});

// @route   DELETE api/posts
// @desc    get all posts
// @access  Private
router.delete("/", (req, res) => {
  res.send("DELETE api/clublist");
});

module.exports = router;
