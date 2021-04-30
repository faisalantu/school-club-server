const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  studentid: {
    type: String,
    required: true,
  },
  IsAdmin: {
    type: Boolean,
    required: true,
  },
  IsPrecedent: {
    type: Boolean,
    required: true,
  },
  clubID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:'ClubList'
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('user', UserSchema);