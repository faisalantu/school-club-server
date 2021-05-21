// this middleware gets userId from auth middleware and checks if the user
// is valid precedent or not
// ==> use this middleware after auth middleware

const UserModel = require("../models/User");
const mongoose = require("mongoose");

module.exports = async function (req, res, next) {
  try {
    //check user by id
    const user = await UserModel.findById(req.user.id).exec();

    //can be checked with == but for security used === and JSON.stringgify
    if (
      user.isPrecedent === true &&
      mongoose.Types.ObjectId(user.presidentOf)
    ) {
      console.log("valid president");
      req.presidentOf = user.presidentOf;
      next();
    } else {
      res.status(401).send({
        success: false,
        masssage: "Not authorized to add post in this category",
      });
    }
  } catch (err) {
    res.status(500).send({ success: false, masssage: "no user found" });
  }
};
