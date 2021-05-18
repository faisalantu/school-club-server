const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const roleSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: { type: String, slug: "name", unique: true },

  detail: {
    type: String,
    required: true, 
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model('Role', roleSchema);