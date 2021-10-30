const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/auth");

const { check, validationResult } = require("express-validator");
const { cloudinary } = require("../utils/cloudinary");
const User = require("../models/User");
// @route   GET api/users
// @desc    get 1 users
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).send(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ success: false, masssage: "user not found" });
  }
});
// @route   GET api/users
// @desc    get all matched user users
// @access  Private  admin route
router.get("/all", auth, async (req, res) => {
  try {
    let { name } = req.query;
    if (name.length < 2) {
      // res.status(200).send([]);
      name = null;
    }
    const regex = new RegExp(name, "i"); // i for case insensitive
    const user = await User.find({
      $or: [
        { firstname: { $regex: regex } },
        { email: { $regex: regex } },
        { lastname: { $regex: regex } },
      ],
    }).select("-password -likes -interested");
    res.status(200).send(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ success: false, masssage: "user not found" });
  }
});
// @route   GET api/users/:ID
// @desc    get 1 users
// @access  Private
router.get("/:ID", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.ID)
      .populate("presidentOf")
      .populate("rolesOf")
      .select("-password -password -likes -interested");
    res.status(200).send(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ success: false, masssage: "user not found" });
  }
});

// @route   GET api/users
// @desc    get 1 users
// @access  Private
router.put("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;
    user.email = req.body.email;
    user.studentid = req.body.studentid;
    user.firstname = req.body.firstname;
    user.depertmentId = req.body.depertmentId;
    //user.interested = req.body.interested;
    user.clubId = req.body.clubId;
    if (req.body.image != null) {
      const imageObj = await cloudinary.uploader.upload(req.body.image, {
        upload_preset: "users",
      });
      user.imageObj = imageObj;
    }
    //console.log(user)
    await user.save();
    res.status(200).send({ success: true, masssage: "success" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ success: false, masssage: "user not found" });
  }
});

// @route   POST api/users
// @desc    get all users
// @access  Private
router.post(
  "/",
  [
    check("image", "Please add profile image").not().isEmpty(),
    check("firstname", "Please add firstname").not().isEmpty(),
    check("lastname", "Please add lastname").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "please enter a password with 6 or more charecters"
    ).isLength({ min: 6 }),
    check("studentid", "Please include a valid studentid").isNumeric(),
    check("depertmentId", "Please add depertment").not().isEmpty(),
    check("interested", "Please add intersted field").not().isEmpty(),
    check("clubId", "Please add club").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      const {
        image,
        firstname,
        lastname,
        email,
        password,
        studentid,
        depertmentId,
        interested,
        clubId,
      } = req.body;
      try {
        let user = await User.findOne({ email });
        if (user) {
          return res.status(400).json({ msg: "User already exist" });
        } else {
          const imageObj = await cloudinary.uploader.upload(image, {
            upload_preset: "users",
          });
          console.log("[imageObj]", imageObj);
          user = new User({
            imageObj,
            firstname,
            lastname,
            email,
            password,
            studentid,
            isAdmin: false,
            isPrecedent: false,
            depertmentId,
            interested,
            clubId,
          });

          const salt = await bcrypt.genSalt(10);

          user.password = await bcrypt.hash(password, salt);
          await user.save();

          const payload = {
            user: {
              id: user.id,
              isAdmin: user.isAdmin,
              isPrecedent: user.isPrecedent,
            },
          };

          jwt.sign(
            payload,
            config.get("jwtSecret"),
            {
              expiresIn: 360000,
            },
            (err, token) => {
              if (err) throw err;
              else res.json({ token });
            }
          );
        }
      } catch (err) {
        console.error(err);
        res.status(500).send("server error");
      }
    }
  }
);

module.exports = router;
