const mongoose = require("mongoose");

const EventSchema = mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  location: {
    type: String,
    require: true,
  },
  tickets: {
    type: Number,
    require: false,
  },
  fee: {
    type: Number,
    require: false,
  },
  eventTime: {
    type: String,
    require: false,
  },
  email:{
      type:String,
      require:true
  },
  contactNumber:{
      type:String,
      require:true
  },
  isPublic:{
    type:Boolean,
    require:true
  },
  userId:{
      type: mongoose.Schema.Types.ObjectId,
      require:true,
      ref:'User'
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Event", EventSchema);
