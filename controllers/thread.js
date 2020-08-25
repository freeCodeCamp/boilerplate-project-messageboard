const Thread = require("../models/thread");

module.exports = {
  postThread(req, res) {
    let board = req.params.board;
    console.log(board);
    let thread = new Thread({
      board: board,
      text: req.body.text,
      delete_password: req.body.delete_password,
      created_on: new Date(),
      bumped_on: new Date(),
      reported: false,
      replies: [],
      replycount: 0
    });

    Thread.create(thread)
      .then(data => {
        res.redirect("/b/" + board);
      })
      .catch(err => res.send(err));
  },
  getAllThreads(req, res) {
    let board = req.params.board;

    Thread.find(
      { board: board },
      { replies: { $slice: -3 } },
      {
        reported: 0,
        delete_password: 0,
        "replies.delete_password": 0,
        "replies.reported": 0
      }
    )
      .sort({ bumped_on: -1 })
      .limit(10)
      .then(data => {
        res.json(data);
      })
      .catch(err => res.send(err));
  },
  updateThread(req, res) {
    console.log("triggered");
    let thread_id = req.body.thread_id;
    console.log(thread_id);
    Thread.findByIdAndUpdate(thread_id, { reported: true })
      .then(data => {
        if (data) {
          res.send("success");
        }
      })
      .catch(err => res.send(err));
  },
  deleteThread(req, res) {
    let thread_id = req.body.thread_id;
    let delete_password = req.body.delete_password;

    Thread.findOne({ _id: thread_id })
      .then(data => {
        if (data.delete_password === delete_password) {
          Thread.deleteOne({ _id: thread_id }).then(data => {
            if (data.ok === 1) {
              res.send("success");
            }
          });
        } else {
          res.send("incorrect password");
        }
      })
      .catch(err => res.send(err));
  }
};
