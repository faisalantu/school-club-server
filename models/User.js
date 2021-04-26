const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  firstname: {
    type: String,
    require: true,
  },
  lastname: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  studentid: {
    type: String,
    require: true,
  },
  IsAdmin: {
    type: Boolean,
    require: true,
  },
  IsPrecedent: {
    type: Boolean,
    require: true,
  },
  clubID: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref:'ClubList'
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('user', UserSchema);