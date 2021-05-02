const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  imageObj: {
    type: Object,
    required: false,
  },
  eventBody: {
    type: Object,
    required: true,
  },
  tags: {
    type: Array,
    required: false,
  },
  isPublic: {
    type: Boolean,
    required: true,
  },
/*   userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  }, */
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", PostSchema);
