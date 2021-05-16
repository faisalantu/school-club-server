const express = require("express");
const router = express.Router();
const PostModel = require("../models/Post");
const auth = require("../middleware/auth");
const postDeleteAuth = require("../middleware/postDeleteAuth");
const { check, validationResult } = require("express-validator");
const { cloudinary } = require("../utils/cloudinary");
const mongoose = require("mongoose");

// @route   GET api/posts
// @desc    get all posts
// @access  Public
// @query   categody,club,skip,limit
router.get("/", async (req, res) => {
  try {
    let { category, club, skip, limit } = req.query;
    skip = Number(skip);
    limit = Number(limit);
    function matchQuery() {
      if (category && club) {
        return {
          "clublist.slug": req.query.club,
          category: req.query.category,
        };
      } else if (category) {
        return {
          category: req.query.category,
        };
      } else if (club) {
        return {
          "clublist.slug": req.query.club,
        };
      } else {
        return {};
      }
    }
    const posts = await PostModel.aggregate()
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
      // .project({
      //   "clublist.slug": 1,
      //   category: 1,
      // })
      .skip(skip ? skip : 0)
      .limit(limit ? limit : 20);

    res.status(200).send(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ success: false, masssage: "no posts" });
  }
});

// @route   GET api/post/one
// @desc    get all post/one
// @access  Public
router.get("/one", async (req, res) => {
  try {
    let { slug, postId } = req.query;
    let postObjId = mongoose.Types.ObjectId(postId);
    function matchQuery() {
      if (slug) {
        return {
          slug: slug,
        };
      } else if (postId) {
        return {
          _id: postObjId,
        };
      } else {
      }
    }
    const posts = await PostModel.aggregate()
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
    res.status(200).send(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ success: false, masssage: "no posts" });
  }
});
// @route   GET api/post/user
// @desc    get all user post
// @access  private
router.get("/user", auth, async (req, res) => {
  let userId = mongoose.Types.ObjectId(req.user.id);
  try {
    const posts = await PostModel.aggregate()
      .lookup({
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userlist",
      })
      .match({ "userlist._id": userId })
      .project({
        "userlist.password": 0,
        "userlist.email": 0,
        clubId: 0,
        userId: 0,
      })
      .limit(20);
    res.status(200).send(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ success: false, masssage: "no posts" });
  }
});

// @route   POST api/posts
// @desc    single POST request
// @access  Private
router.post(
  "/",
  auth,
  [
    check("title", "Please add title").not().isEmpty(),
    check("imageObj", "Please include an image").not().isEmpty(),
    check("eventBody", "Please write someting about the event").not().isEmpty(),
    check("tags", "insert some tags").isArray(),
    check("isPublic", "Please include post visibility")
      .not()
      .isEmpty()
      .isBoolean(),
    check("anonymous", "anyomous should be boolean").isBoolean(),
    check("category", "post must have a category").custom((value) => {
      if (value === "discussion" || value === "issue") {
        console.log(value);
        return value;
      } else {
        throw new Error("lol nice try");
      }
    }),
    check("clubId", "clubId should be string").not().isEmpty().isString(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      try {
        const fileStr = req.body.imageObj;
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
          upload_preset: "posts",
        });
        let post = new PostModel({
          title: req.body.title,
          imageObj: uploadResponse,
          eventBody: req.body.eventBody,
          tags: req.body.tags,
          isPublic: req.body.isPublic,
          anonymous: req.body.anonymous,
          category: req.body.category,
          userId: req.user.id,
          clubId: req.body.clubId,
        });

        try {
          post = await post.save();
          res.send({ success: true, message: "post added " });
        } catch (err) {
          res
            .status(500)
            .send({ success: false, message: "post cannot be created" });
        }
      } catch (err) {
        res
          .status(500)
          .send({ success: false, message: "image upload failed" });
      }
    }
  }
);

// @route   PUT api/posts/one
// @desc    edit one post
// @access  Private
router.put(
  "/one",
  auth,
  [
    check("title", "Please add title").isString(),
    check("imageObj", "Please include an image").optional().isString(),
    check("eventBody", "Please write someting about the event").isString(),
    check("tags", "insert some tags").optional().isArray(),
    check("isPublic", "Please include post visibility").isBoolean(),
    check("anonymous", "anyomous should be boolean").optional().isBoolean(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
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
          .match(matchQuery())
          .project({
            "userlist.password": 0,
            "userlist.email": 0,
            clubId: 0,
            userId: 0,
          })
          .limit(1);
        //check post by id
        const mainPost = await PostModel.findById(post[0]._id);
        //can be checked with == but for security used === and JSON.stringgify
        //checking userid mathced with original post creator
        if (
          JSON.stringify(post[0].userlist[0]._id) ===
          JSON.stringify(req.user.id)
        ) {
          mainPost.title = req.body.title;
          mainPost.eventBody = req.body.eventBody;
          mainPost.tags = req.body.tags;
          mainPost.isPublic = req.body.isPublic;
          mainPost.anonymous = req.body.anonymous;
          if (req.body.imageObj) {
            const tempPublicId = mainPost.imageObj.public_id;
            const imageObj = await cloudinary.uploader.upload(
              req.body.imageObj,
              {
                upload_preset: "posts",
              }
            );
            mainPost.imageObj = imageObj;
            const result = await cloudinary.uploader.rename(
              tempPublicId,
              `deleted/${tempPublicId}`,
              (options = {})
            );
          }
          await mainPost.save();
          res.status(200).send(mainPost);
        } else {
          res.status(500).send({
            success: false,
            masssage: "You dont have permisson to Edit this post",
          });
        }
      } catch (err) {
        console.error(err.message);
        res.status(500).send({ success: false, masssage: "no posts" });
      }
    }
  }
);

// @route   DELETE api/posts/one
// @desc    delete one post
// @access  Private
router.delete("/one", auth, postDeleteAuth, async (req, res) => {
  let { postId } = req.query;
  //check post by id
  const post = await PostModel.deleteOne({ _id: postId });
  res.send(post);
});

module.exports = router;
