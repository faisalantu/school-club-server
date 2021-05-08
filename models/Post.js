const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const PostSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: { type: String, slug: "title", unique: true },
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
  anonymous: {
    type: Boolean,
    required: false,
    default: false,
  },
  category: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  clubId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "ClubList",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", PostSchema);
