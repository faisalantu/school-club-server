const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  readTime: {
    type: Number,
    required: false,
  },
  tags: {
    type: Array,
    required: false,
  },
  img: {
    type: String,
    required: false,
  },
  body:{
      type:String,
      required:true
  },
  category:{
      type:String,
      required:true
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", UserSchema);
