const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

const { check, validationResult } = require("express-validator");
const User = require("../models/User");

// @route   POST api/users
// @desc    get all users
// @access  Private
router.post(
  "/",
  [
    check("username", "Please add username").not().isEmpty(),
    check("firstname", "Please add firstname").not().isEmpty(),
    check("lastname", "Please add lastname").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "please enter a password with 6 or more charecters"
    ).isLength({ min: 6 }),
    check("studentid", "Please include a valid studentid").isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      const { username,firstname,lastname, email, password,studentid } = req.body;
      try {
        let user = await User.findOne({ email });
        if (user) {
          return res.status(400).json({ msg: "User already exist" });
        } else {
          user = new User({
            username,
            firstname,
            lastname,
            email,
            password,
            studentid,
          });

          const salt = await bcrypt.genSalt(10);

          user.password = await bcrypt.hash(password, salt);
          await user.save();

          const payload = {
            user: {
              id: user.id,
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
