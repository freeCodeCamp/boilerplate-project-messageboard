const { validatePassword } = require("../password_encryption/password");
const { getThreadsArray } = require("./arrays");

const BoardModel = require('../models').Board
const ThreadModel = require('../models').Thread

function createNewThread(board, text, delete_password) {
    let timestamp = new Date()
    const newThread = new ThreadModel({
        text: text,
        delete_password: delete_password,
        created_on: timestamp,
        bumped_on: timestamp
    })

    return BoardModel.findOneAndUpdate({name: board}, { $push: { threads: newThread }}, {new: true})
    .then(boardData => {
        if(!boardData) {
            let newBoard = new BoardModel({ name: board, threads: [newThread] })
            return newBoard.save()
            .then(data => {
                return newThread
            })
        }
        else {            
            return newThread
        }
    })
}

function getThreads(board) {
    return BoardModel.findOne({name: board})
    .then(boardData => {
        const threads = getThreadsArray(boardData.threads)
        return threads
    })
}

function reportThread(board, thread_id) {
    return BoardModel.findOne({name: board})
      .then(boardData => {
        //console.log(boardData)
        let thread = boardData.threads.id(thread_id)
        thread.reported = true
        boardData.save()
        .then(data => {
        })
        .catch(error => {
            console.error(error)
        })
      })
      .catch(error => {
        console.error(error)
      })
}

function deleteThread(board, thread_id, delete_password) {
    return BoardModel.findOne({ name: board })
    .then(boardData => {
        let thread = boardData.threads.id(thread_id)
        return validatePassword(delete_password, thread.delete_password)
        .then(valid => {
            if(valid) {
                boardData.threads.remove(thread)
                return boardData.save()
                .then(data => {
                    return 'success'
                })
            }
            else {
                return 'incorrect password'
            }
        })
        .catch(error => {
            console.error(error)
        })
    })
    .catch(error => {
        console.error(error)
    })
}


exports.createNewThread = createNewThread
exports.getThreads = getThreads
exports.reportThread = reportThread
exports.deleteThread = deleteThread