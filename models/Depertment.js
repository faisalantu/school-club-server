const mongoose = require("mongoose");

const DepertmentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  intersted: {
    type: Array,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Depertment", DepertmentSchema);
