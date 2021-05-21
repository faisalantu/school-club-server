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
    try {
        const precedent = await Club.find({ precedent: { $exists: true } }).populate('precedent', "_id firstname lastname imageObj").select("precedent name")
        const memberWithRoles = await User.find({ "roles.0": { "$exists": true } }).populate('roles', 'name _id').select("roles _id firstname lastname imageObj")
        res.status(200).send({ memberWithRoles, precedent });
    } catch (error) {
        res.status(500).send({ success: false, error: error });
    }

});

// router.get("/test", async (req, res) => {
//     try {
//        await User.updateMany({},{ $pull: { roles: '60a7f15f3c94f2485cdfe508'} })
//         res.status(200).send({ mas:"dom"}); 
//     } catch (error) {
//         res.status(500).send({ mas:"not dom"});  
//     }

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
        //console.log("put", req.body);
        try {
            let alreadyAprecedent = false
            const { userId, precedent, selectedClubName, RolesId, clubId } = req.body
            //console.log("userId", userId, "precedent", precedent, "selectedClubName", selectedClubName, "RolesId", RolesId)
            const isclubprecedent = await Club.find({ precedent: userId, _id: { $ne: clubId } });
            const isprecedent = await Club.find({ precedent: userId });
            if (precedent === true) {
                console.log(isprecedent.length < 1)
                if (isclubprecedent.length > 0) {
                    alreadyAprecedent = true
                    //res.send({ success: false, massage:alreadyAprecedent ? `user is already precedent of ${isclubprecedent[0].name}--- `:"updated" });
                }
                else if (isprecedent.length < 1) {

                    // previous Precedent to normal user 
                    const club = await Club.find({ precedent: userId, _id: clubId });
                    await User.updateOne({ _id: club.precedent }, { $set: { isPrecedent: false, presidentOf: null } });
                    // normal user to precedent
                    await Club.updateOne({ _id: clubId }, { $set: { precedent: userId } });
                    await User.updateOne({ _id: userId }, { $set: { isPrecedent: precedent, presidentOf: clubId } });
                }

            }
            await User.updateOne({ _id: userId }, { $set: { roles: RolesId, presidentOf: clubId } });
            res.send({ success: true, massage: alreadyAprecedent ? `user is already precedent of ${isclubprecedent[0].name} ` : "updated" });
            // res.send({ success: true ,massage:"updated" });
        } catch (error) {
            console.log("error:", error)
            res.send({ success: false, massage: error });
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
