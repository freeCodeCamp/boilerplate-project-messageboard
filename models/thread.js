const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Thread = new Schema({
  board: { type: "string", required: true },
  text: { type: "string", required: true },
  delete_password: { type: "string", required: true },
  created_on: { type: Date, default: Date.now },
  bumped_on: { type: Date, default: Date.now },
  reported: Boolean,
  replies: [
    {
      text: String,
      created_on: { type: Date, default: Date.now },
      reported: Boolean,
      delete_password: String
    }
  ],
  replycount: Number
});

module.exports = mongoose.model("Thread", Thread);
