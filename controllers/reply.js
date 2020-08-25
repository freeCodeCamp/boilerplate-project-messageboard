const Thread = require("../models/thread");

module.exports = {
  postReply(req, res) {
    let board = req.params.board;
    let thread_id = req.body.thread_id;
    let reply = {
      text: req.body.text,
      delete_password: req.body.delete_password,
      created_on: new Date(),
      reported: false
    };

    Thread.findOneAndUpdate(
      { _id: thread_id },
      {
        $set: { bumped_on: new Date() },
        $push: { replies: reply },
        $inc: { replycount: 1 }
      }
    )
      .then(data => {
        res.redirect("/b/" + board);
      })
      .catch(err => res.send(err));
  },
  getAllReplies(req, res) {
    let thread_id = req.query.thread_id;

    Thread.findOne(
      { _id: thread_id },
      {
        reported: 0,
        delete_password: 0,
        "replies.reported": 0,
        "replies.delete_password": 0
      }
    )
      .then(data => {
        res.json(data);
      })
      .catch(err => res.send(err));
  },
  updateReply(req, res) {
    let thread_id = req.body.thread_id;
    let reply_id = req.body.reply_id;

    Thread.findOneAndUpdate(
      { _id: thread_id, "replies._id": reply_id },
      { "replies.$.reported": true }
    )
      .then(data => {
        if (data) {
          res.send("success");
        }
      })
      .catch(err => console.log(err));
  },
  deleteReply(req, res) {
    let thread_id = req.body.thread_id;
    let reply_id = req.body.reply_id;
    let delete_password = req.body.delete_password;

    Thread.findOneAndUpdate(
      {
        _id: thread_id,
        replies: {
          $elemMatch: { _id: reply_id, delete_password: delete_password }
        }
      },
      { "replies.$.text": "[deleted]" }
    )
      .then(data => {
        console.log(data);
        if (data) {
          res.send("success");
        } else {
          res.send("incorrect password");
        }
      })
      .catch(err => console.log(err));
  }
};
