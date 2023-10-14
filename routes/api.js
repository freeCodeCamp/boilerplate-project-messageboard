'use strict';

const { Board, Thread } = require('../models');


const ObjectId = require('mongodb').ObjectId
const BoardModel = require('../models').Board
const ThreadModel = require('../models').Thread
const ReplyModel = require('../models').Reply

module.exports = function (app) {

  app.route('/api/threads/:board')
    .post(function(req, res) {
      const {text, delete_password} = req.body
      const newThread = new ThreadModel({
        text: text,
        delete_password: delete_password
      })
      BoardModel.findOneAndUpdate({name: req.params.board}, { $push: { threads: newThread }}, {new: true})
      .then(board => {
        if(!board) {
          let newBoard = new BoardModel({ name: req.params.board, threads: [newThread] })
          newBoard.save()
          .then(data => {
            res.json(newThread)
          })
        }
        else {            
          res.json(newThread)
        }
      })
      .catch(error => {
        res.json({ error: 'Could not save thread' })
      })
    })
    .get(function(req, res) {
      BoardModel.findOne({name: req.params.board})
      .then(board => {
        
        board.threads.sort((a,b) => {return a.bumped_on > b.bumped_on ? -1: a.bumped_on < b.bumped_on ? 1 : 0})
        if(board.threads.length > 10) {
          board.threads = board.threads.slice(0,10)
        }

        const threads = board.threads.map(thread => {
          const {
            _id,
            text,
            created_on,
            bumped_on
          } = thread

          thread.replies.sort((a,b) => {return a.created_on > b.created_on ? -1: a.created_on < b.created_on ? 1 : 0})
          
          if(thread.replies.length > 3) {
            thread.replies = thread.replies.slice(0,3)
          }

          const replies = thread.replies.map(reply => {
            const {
              _id,
              text,
              created_on
            } = reply
            return {
              _id,
              text,
              created_on
            }
          })

          return {
            _id,
            text,
            created_on,
            bumped_on,
            replies,
            replyCount: replies.length
          }
        })
        res.json(threads)
      })
      .catch(error => {
        console.error(error)
        res.json({ error: "could not add reply"})
      })
      
    })
    .delete(function(req, res) {
      BoardModel.findOne({ name: req.params.board })
      .then(board => {
        let thread = board.threads.id(req.body.thread_id)
        if(thread.delete_password === req.body.delete_password) {
          board.threads.remove(thread)
          board.save()
          .then(data => {
            res.send('success')
          })
        }
        else {
          res.send('incorrect password')
        }
      })
      
    })
    .put(function(req, res) {
      BoardModel.findOne({name: req.params.board})
      .then(board => {
        let thread = board.threads.id(req.body.thread_id)
        thread.reported = true
        board.save()
        .then(data => {
          res.send('reported')
        })
      })
    })
    
  app.route('/api/replies/:board')
    .post(function(req, res) {
      let timestamp = new Date()
      let newReply = new ReplyModel({ 
        text: req.body.text, 
        delete_password: req.body.delete_password,
        created_on: timestamp
      })
      BoardModel.findOne({name: req.params.board})
      .then(board => {
        if(!board) {
          res.json({error: "could not find board"})
        }
        else {
          let thread = board.threads.id(req.body.thread_id)
          thread.bumped_on = new Date();
          thread.replies.push(newReply)
          board.save()
          .then(data => {
            res.json(newReply)
          })
          .catch(error => {
            res.json({error: "couldn't add reply"})
          })
        }
      })
      .catch(error => {
        res.json({error: "couldn't add reply"})
      })

    })
    .get(function(req, res) {

      BoardModel.findOne({name: req.params.board})
      .then(board => {
        let thread = board.threads.id(req.query.thread_id)
        let replies = thread.replies
        replies.sort((a,b) => {return a.created_on > b.created_on ? -1 : a.created_on < b.created_on ? 1 : 0})
        replies = replies.map(reply => {
          const {
            _id,
            text,
            created_on
          } = reply;
          return {
            _id,
            text,
            created_on
          };
        })
        res.json({
          _id: thread._id,
          text: thread.text,
          created_on: thread.created_on,
          bumped_on: thread.bumped_on,
          replies: replies
        })
      })
      .catch(error => {
        console.error(error)
      })
      
    })
    .delete(function(req, res) {
      BoardModel.findOne({ name: req.params.board })
      .then(board => {
        let thread = board.threads.id(req.body.thread_id)
        if(thread.delete_password === req.body.delete_password) {
          let reply = thread.replies.id(req.body.reply_id)
          reply.text = "[deleted]"
          board.save()
          .then(data => {
            res.send('success')
          })
          

        }
        else {
          res.send('incorrect password')
        }
      })
    })
    .put(function(req, res) {
      BoardModel.findOne({ name: req.params.board })
      .then(board => {
        let thread = board.threads.id(req.body.thread_id)
        let reply = thread.replies.id(req.body.reply_id)
        reply.reported = true
        board.save()
        .then(data => {
          res.send('reported')
        })
      })
    })

};
