const mongoose = require("mongoose");
const { Schema } = mongoose;

const replySchema = new Schema({
    text: {type: String, required: true},
    created_on: {type: Date, default: new Date()},
    delete_password: {type: String, required: true},
    reported: {type: Boolean, default: false}
})

const Reply = mongoose.model("Replies", replySchema);

const threadSchema = new Schema({
    text: {type: String, required: true},
    created_on: {type: Date, default: new Date()},
    bumped_on: {type: Date, default: new Date()},
    delete_password: {type: String, required: true},
    reported: {type: Boolean, default: false},
    replies: [Reply]
})

const Thread = mongoose.model("Threads", threadSchema);

const boardSchema = new Schema({
    name: {type: String, required: true},
    threads: [Thread]
})

const Board = mongoose.model("Boards", boardSchema);

exports.Reply = Reply
exports.Thread = Thread
exports.Board = Board