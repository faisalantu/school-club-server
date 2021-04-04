const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  type: {
    type: String,
    require: true,
  },
  readTime: {
    type: Number,
    require: false,
  },
  tags: {
    type: Array,
    require: false,
  },
  img: {
    type: String,
    require: false,
  },
  body:{
      type:String,
      require:true
  },
  category:{
      type:String,
      require:true
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", UserSchema);
