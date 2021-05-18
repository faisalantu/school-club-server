const express = require("express");
const router = express.Router();
const role = require("../models/Role");
const Club = require("../models/ClubList");
const User = require("../models/User");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

// @route   GET api/role
// @desc    get all role
// @access  Public
router.get("/", async (req, res) => {
  //   const user = await User.aggregate()
  //   .lookup({
  //     from: "clubLists",
  //     localField: "clubId",
  //     foreignField: "_id",
  //     as: "clubList",
  //   })
  //   .lookup({
  //     from: "roles",
  //     localField: "roles",
  //     foreignField: "_id",
  //     as: "roles",
  //   })
  //   .match({_id:req.query.id})
  // if (user) {
  //   res.status(200).send(user);
  // } else {
  //   res.status(400).send({ success: false, masssage: "user not found" });
  // }
  // var fields = { 'precedent.clubId': 1, 'precedent.firstname': 1 };
  // const theuser =await  User.populate(user, { path: 'clubId.clublist', model: 'ClubList', select: { 'name': 1, } })
  const precedent = await Club.find().populate('precedent',"_id firstname lastname imageObj").select("precedent name")
  const memberWithRoles = await User.find({ "roles.0": { "$exists": true } }).populate('roles','name _id').select("roles _id firstname lastname imageObj")
  // const user = await User.find({$where:'this.clubId.length>0'} ).populate('clubId','name _id').select("clubId _id firstname lastname imageObj")
  res.status(200).send({memberWithRoles ,precedent});
});

// @route   POST api/role
// @desc    get all role
// @access  Private
// router.post("/", auth, async (req, res) => {
//   let roleList = new role({
//     name: req.body.name,
//     detail: req.body.detail,
//   });
//   roleList = await roleList.save();
//   if (!roleList) {
//     res
//       .status(500)
//       .send({ success: false, message: "The roleList cannot be created" });
//   }
//   res.send({ success: true, message: "role added " });
// });

// @route   PUT api/role
// @desc    get all role
// @access  Private
router.put(
    "/",
    auth,
    [
        check("userId", "Please add userId").not().isEmpty(),
        check("precedent", "Please include precedent").not().isEmpty(),
        check("selectedClubName", "Please include Club").not().isEmpty(),
        check("RolesId", "Please include Club").not().isEmpty(),
        check("clubId", "Please include Roles").not().isEmpty(),
    ],
    async (req, res) => {
        console.log("put", req.body);
        try {
            const { userId, precedent, selectedClubName, RolesId, clubId } = req.body
            console.log("userId", userId, "precedent", precedent, "selectedClubName", selectedClubName, "RolesId", RolesId)
            if (precedent === true) {
              // previous Precedent to normal user 
                const club = await Club.find({ _id: clubId });
                await User.updateOne({ _id: club.precedent }, { $set: { isPrecedent: false } });
                // normal user to precedent
                await Club.updateOne({ _id: clubId }, { $set: { precedent: userId } });
                await User.updateOne({ _id: userId }, { $set: { isPrecedent: precedent } });
            }
            if(RolesId.length > 0){
                await User.updateOne({ _id: userId }, { $set: { roles: RolesId } });
            }
            res.send({ success: true});
        } catch (error) {
            console.log(error)
            res.send({ success: false });
        }


    }
);

// @route   DELETE api/role
// @desc    get all role
// @access  Private
// router.delete("/:ID", (req, res) => {
//     role.deleteOne(
//         {_id: req.params.ID},
//         function(err){
//           if (!err){
//             res.send("Successfully deleted the corresponding article.");
//           } else {
//             res.send(err);
//           }
//         }
//       );
// });

module.exports = router;
