const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
const ClubListSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: { type: String, slug: "name", unique: true },
  precedent: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref:"user"
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ClubList", ClubListSchema);
