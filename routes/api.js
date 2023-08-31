'use strict';

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .post(function(req, res) {
      res.json(req.body)
    })
    .get(function(req, res) {
      res.json([])
    })
    
  app.route('/api/replies/:board');

};
