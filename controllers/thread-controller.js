const { generateHash } = require("../password_encryption/password");

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

exports.createNewThread = createNewThread