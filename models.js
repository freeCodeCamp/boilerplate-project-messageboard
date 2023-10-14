const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const replySchema = new Schema({
    text: {type: String, required: true},
    created_on: Date,
    delete_password: {type: String, required: true},
    reported: {type: Boolean, default: false}
}, {versionKey: false})

const Reply = mongoose.model("Replies", replySchema);

const threadSchema = new Schema({
    text: {type: String, required: true},
    created_on: Date,
    bumped_on: Date,
    delete_password: {type: String, required: true},
    reported: {type: Boolean, default: false},
    replies: [replySchema]
}, {versionKey: false})

const Thread = mongoose.model("Threads", threadSchema);

const boardSchema = new Schema({
    name: {type: String, required: true},
    threads: [threadSchema]
}, {versionKey: false})

const Board = mongoose.model("Boards", boardSchema);

exports.Reply = Reply
exports.Thread = Thread
exports.Board = Board