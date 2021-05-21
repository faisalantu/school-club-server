const express = require("express");
const router = express.Router();
const role = require("../models/Role");
const User = require("../models/User");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

// @route   GET api/role
// @desc    get all role
// @access  Public
router.get("/", async (req, res) => {
  const roleList = await role.find();
  if (roleList) {
    res.status(200).send(roleList);
  } else {
    res.status(400).send({ success: false, masssage: "roleLists not found" });
  }
});

// @route   POST api/role
// @desc    get all role
// @access  Private
router.post("/", auth, async (req, res) => {
  let roleList = new role({
    name: req.body.name,
    detail: req.body.detail,
  });
  roleList = await roleList.save();
  if (!roleList) {
    res
      .status(500)
      .send({ success: false, message: "The roleList cannot be created" });
  }
  res.send({ success: true, message: "role added " });
});

// @route   PUT api/role
// @desc    get all role
// @access  Private
router.put(
  "/:ID",
  auth,
  [
    check("name", "Please add name").not().isEmpty(),
    check("detail", "Please include detail").not().isEmpty(),
  ],
  (req, res) => {
    console.log("put(/:ID)", req.body);
    role.updateOne({ _id: req.params.ID }, { $set: req.body }, function (err) {
      if (!err) {
        res.send("Successfully updated role.");
      } else {
        res.send(err);
      }
    });
  }
);

// @route   DELETE api/role
// @desc    get all role
// @access  Private
router.delete("/:ID", async (req, res) => {
  console.log(typeof req.params.ID)
    // role.deleteOne(
    //     {_id: req.params.ID},
    //     function(err){
    //       if (!err){
    //         User.updateMany({},{ $pull: { roles: req.params.ID} })
    //         res.send("Successfully deleted the corresponding article.");
    //       } else {
    //         res.send(err);
    //       }
    //     }
    //   );
    try {
      await role.deleteOne({_id: req.params.ID} ) 
      await User.updateMany({},{ $pull: { roles: req.params.ID} }) 
      res.send("Successfully deleted the corresponding role.");   
    } catch (error) {
     console.log(error)
      res.send(error);
    }
});

module.exports = router;
