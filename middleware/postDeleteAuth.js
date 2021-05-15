const PostModel = require("../models/Post");
const UserModel = require("../models/User");
const mongoose = require("mongoose");

module.exports = async function (req, res, next) {
  try {
    let { slug, postId } = req.query;
    let postObjId = mongoose.Types.ObjectId(postId);
    function matchQuery() {
      if (slug) {
        return {
          slug: slug,
        };
      }
      if (postId) {
        return {
          _id: postObjId,
        };
      } else {
      }
    }
    const post = await PostModel.aggregate()
      .lookup({
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userlist",
      })
      .lookup({
        from: "clublists",
        localField: "clubId",
        foreignField: "_id",
        as: "clublist",
      })
      .match(matchQuery())
      .project({
        "userlist.password": 0,
        "userlist.email": 0,
        clubId: 0,
        userId: 0,
      })
      .limit(1);

    //check user by id
    const user = await UserModel.aggregate()
      .lookup({
        from: "clublists",
        localField: "presidentOf",
        foreignField: "_id",
        as: "presidentInfo",
      })
      .match({ _id: mongoose.Types.ObjectId(req.user.id) })
      .project({
        isAdmin: 1,
        isPrecedent: 1,
        presidentInfo: 1,
      })
      .limit(1);


    //can be checked with == but for security used === and JSON.stringgify
    if (user[0].isAdmin === true) {
      console.log("mathced admin");
      next();
    } else if (
      user[0].isPrecedent === true &&
      user[0].presidentInfo[0].slug === post[0].clublist[0].slug
    ) {
      console.log("valid president");
      next();
    } else if (
      JSON.stringify(post[0].userlist[0]._id) === JSON.stringify(req.user.id)
    ) {
      console.log("matched user");
      next();
    } else {
      res
        .status(401)
        .send({ success: false, masssage: "Not authorized to delete" });
    }
  } catch (err) {
    res.status(500).send({ success: false, masssage: "no posts" });
  }
};
