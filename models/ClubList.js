const mongoose = require("mongoose");

const ClubListSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ClubList", ClubListSchema);
