'use strict';

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .post(function(req, res) {
      res.json(req.body)
    })
    .get(function(req, res) {
      res.json([])
    })
    .delete(function(req, res) {

    })
    .put(function(req, res) {

    })
    
  app.route('/api/replies/:board')
    .post(function(req, res) {
      res.json({})
    })
    .get(function(req, res) {
      res.json({})
    })
    .delete(function(req, res) {
      res.json({})
    })
    .put(function(req, res) {
      res.json({})
    })

};
