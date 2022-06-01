const jwt = require("jsonwebtoken");
const config = require("config");
require('dotenv').config();
module.exports = function (req, res, next) {
  //get token from the header
  const token = req.header("x-auth-token");

  //check if not token
  if (!token) {
    return res
      .status(401)
      .json({ success: false, msg: "no token, auth denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.user.isAdmin === false) {
      return res
        .status(401)
        .json({ success: false, msg: " auth denied , not admin" });
    }
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ success: false, msg: "token is not valid" });
  }
};
