const mongoose = require("mongoose");

const ClubListSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  precedent: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ClubList", ClubListSchema);
