const mongoose = require("mongoose");

const EventSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  tickets: {
    type: Number,
    required: false,
  },
  fee: {
    type: Number,
    required: false,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  eventDate: {
    type: Object,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  imageObj: {
    type: Object,
    required: true,
  },
  eventBody: {
    type: Object,
    required: true,
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

module.exports = mongoose.model("Event", EventSchema);
