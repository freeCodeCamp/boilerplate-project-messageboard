const { getRepliesArray } = require('./arrays')

const BoardModel = require('../models').Board
const ThreadModel = require('../models').Thread
const ReplyModel = require('../models').Reply

function addReply(board, thread_id, text, hash) {
    let timestamp = new Date()

    const reply = new ReplyModel({ 
        text: text, 
        delete_password: hash,
        created_on: timestamp
    })

    return BoardModel.findOne({name: board})
    .then(boardData => {
      if(!boardData) {
        return ({error: "could not find board"})
      }
      else {
        let thread = boardData.threads.id(thread_id)
        thread.bumped_on = timestamp;
        thread.replies.push(reply)
        return boardData.save()
        .then(data => {
            return reply
        })
        .catch(error => {
          console.error(error)
        })
      }
    })
    .catch(error => {
        console.error(error)
    })
}

function getReplies(board, thread_id) {
    return BoardModel.findOne({name: board})
    .then(boardData => {
        let thread = boardData.threads.id(thread_id)
        let replies = getRepliesArray(thread.replies, true)
        return {
            _id: thread._id,
            text: thread.text,
            created_on: thread.created_on,
            bumped_on: thread.bumped_on,
            replies: replies
        }
    })
    .catch(error => {
        console.error(error)
    })
}

function reportReply(board, thread_id, reply_id) {
    return BoardModel.findOne({ name: board })
    .then(boardData => {
        let thread = boardData.threads.id(thread_id)
        let reply = thread.replies.id(reply_id)
        reply.reported = true
        return boardData.save()
        .then(data => {
          return 'reported'
        })
    })
}

exports.addReply = addReply
exports.getReplies = getReplies
exports.reportReply = reportReply