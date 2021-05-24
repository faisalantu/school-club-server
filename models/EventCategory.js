const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const EventCategory = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: { type: String, slug: "title", unique: true },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Eventcategory", EventCategory);
