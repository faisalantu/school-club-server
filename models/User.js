const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  imageObj: {
    type: Object,
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
  isAdmin: {
    type: Boolean,
    required: true,
  },
  isPrecedent: {
    type: Boolean,
    required: true,
  },
  depertmentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:'Depertment'
  },
  interested: {   
    type: Array,
    required: true,
  },
  likes: {
    type: Array,
    required: false,
  },
  clubId: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref:'ClubList'
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('user', UserSchema);