const mongoose = require("mongoose");
const PostLikeSchema = mongoose.Schema({
  uid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "post",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
  },
  postType:{
    type: String,
    required: false
  }
});

module.exports = mongoose.model("PostLike", PostLikeSchema);
