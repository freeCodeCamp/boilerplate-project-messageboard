/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;

const threadController = require("../controllers/thread");
const replyController = require("../controllers/reply");

module.exports = function(app) {
  app
    .route("/api/threads/:board")
    .post(threadController.postThread)
    .get(threadController.getAllThreads)
    .put(threadController.updateThread)
    .delete(threadController.deleteThread);

  app
    .route("/api/replies/:board")
    .post(replyController.postReply)
    .get(replyController.getAllReplies)
    .put(replyController.updateReply)
    .delete(replyController.deleteReply);
};
