'use strict';

var expect = require('chai').expect;
let mongodb = require('mongodb')
let mongoose = require('mongoose')

module.exports = function (app) {

	let uri = 'mongodb+srv://user1:' + process.env.PW + '@freecodecamp.b0myq.mongodb.net/anonymous_message_board?retryWrites=true&w=majority'
	mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }); 

	let replySchema = new mongoose.Schema({
		text: {type: String, required: true},
		delete_password: {type: String, required: true},
		createdon_ : {type: Date, required: true},
		reported: {type: Boolean, required: true}
	})

	let threadSchema = new mongoose.Schema({
		text: {type: String, required: true},
		delete_password: {type: String, required: true},
		board: {type: String, required: true},
		createdon_: {type: Date, required: true},
		bumpedon_: {type: Date, required: true},
		reported: {type: Boolean, required: true},
		replies: [replySchema]
	})

	let Reply = mongoose.model('Reply', replySchema)
	let Thread = mongoose.model('Thread', threadSchema)

	app.post('/api/threads/:board', (request, response) => {
		let newThread = new Thread(request.body)
		if(!newThread.board || newThread.board === ''){
			newThread.board = request.params.board
		}
		newThread.createdon_ = new Date().toUTCString()
		newThread.bumpedon_ = new Date().toUTCString()
		newThread.reported = false
		newThread.replies = []
		newThread.save((error, savedThread) => {
			if(!error && savedThread){
				return response.redirect('/b/' + savedThread.board + '/' + savedThread.id)
			}
		})
	})

	app.post('/api/replies/:board', (request, response) => {
		let newReply = new Reply(request.body)
		newReply.createdon_ = new Date().toUTCString()
		newReply.reported = false
		Thread.findByIdAndUpdate(
			request.body.thread_id,
			{$push: {replies: newReply}, bumpedon_: new Date().toUTCString()},
			{new: true},
			(error, updatedThread) => {
				if(!error && updatedThread){
					response.redirect('/b/' + updatedThread.board + '/' + updatedThread.id + '?new_reply_id=' + newReply.id)
				}
			}
		)
	})

	app.get('/api/threads/:board', (request, response) => {

		Thread.find({board: request.params.board})
			.sort({bumpedon_: 'desc'})
			.limit(10)
			.select('-delete_password -reported')
			.lean()
			.exec((error, arrayOfThreads) => {
				if(!error && arrayOfThreads){
					
					arrayOfThreads.forEach((thread) => {

						thread['replycount'] = thread.replies.length

						/* Sort Replies by Date */
						thread.replies.sort((thread1, thread2) => {
							return thread2.createdon_ - thread1.createdon_
						})

						/* Limit Replies to 3 */
						thread.replies = thread.replies.slice(0, 3)

						/* Remove Delete Pass from Replies */
						thread.replies.forEach((reply) => {
							reply.delete_password = undefined
							reply.reported = undefined
						})

					})

					return response.json(arrayOfThreads)

				}
			})

	})

	app.get('/api/replies/:board', (request, response) => {

		Thread.findById(
			request.query.thread_id,
			(error, thread) => {
				if(!error && thread){
					thread.delete_password = undefined
					thread.reported = undefined

					thread['replycount'] = thread.replies.length

					/* Sort Replies by Date */
					thread.replies.sort((thread1, thread2) => {
						return thread2.createdon_ - thread1.createdon_
					})

					/* Remove Delete Pass from Replies */
					thread.replies.forEach((reply) => {
						reply.delete_password = undefined
						reply.reported = undefined
					})

					return response.json(thread)

				}
			}
		)

	})

	app.delete('/api/threads/:board', (request, response) => {

		Thread.findById(
			request.body.thread_id,
			(error, threadToDelete) => {
				if(!error && threadToDelete){

					if(threadToDelete.delete_password === request.body.delete_password){

						Thread.findByIdAndRemove(
							request.body.thread_id,
							(error, deletedThread) => {
								if(!error && deletedThread){
									return response.json('success')
								}
							}
						)

					}else{
						return response.json('incorrect password')
					}

				}else{
					return response.json('Thread not found')
				}

			}
		)

	})

	app.delete('/api/replies/:board', (request, response) => {

		Thread.findById(
			request.body.thread_id,
			(error, threadToUpdate) => {
				if(!error && threadToUpdate){

					let i
					for (i = 0; i < threadToUpdate.replies.length; i++){
						if(threadToUpdate.replies[i].id === request.body.reply_id){
							if(threadToUpdate.replies[i].delete_password === request.body.delete_password){
								threadToUpdate.replies[i].text = '[deleted]'
							}else{
								return response.json('incorrect password')
							}
						}
					}

					threadToUpdate.save((error, updatedThread) => {
						if(!error && updatedThread){
							return response.json('success')
						}
					})

				}else{
					return response.json('Thread not found')
				}
			}
		)
	})

	app.put('/api/threads/:board', (request, response) => {

		Thread.findByIdAndUpdate(
			request.body.thread_id,
			{reported: true},
			{new: true},
			(error, updatedThread) => {
				if(!error && updatedThread){
					return response.json('success')
				}
			}
		)
	})

	app.put('/api/replies/:board', (request, response) => {
		Thread.findById(
			request.body.thread_id,
			(error, threadToUpdate) => {
			if(!error && threadToUpdate){

				let i
				for (i = 0; i < threadToUpdate.replies.length; i++) {
					if(threadToUpdate.replies[i].id === request.body.reply_id){
						threadToUpdate.replies[i].reported = true
					}
				}

				threadToUpdate.save((error, updatedThread) => {
					if(!error && updatedThread){
						return response.json('success')
					}
				})

			}
			}
		)
	})
  
  //app.route('/api/threads/:board');
  //app.route('/api/replies/:board');
};