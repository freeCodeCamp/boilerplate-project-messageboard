/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
       test('create 2 new threads (one is deleted in the delete test)', function(done) {

        //done();
       })
    });
    
    suite('GET', function() {
      test('most recent 10 threads with most recent 3 replies each', function(done) {

        //done();
      })
    });
    
    suite('DELETE', function() {
      test('delete thread with good password', function(done) {

        //done();
      })

      test('delete thread with bad password', function(done) {

        //done();
      })
    });
    
    suite('PUT', function() {
      test('report thread', function(done) {

        //done();
      })
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      test('reply to thread', function(done) {

        //done();
      })
    });
    
    suite('GET', function() {
      test('get all replies for 1 thread', function(done) {

        //done();
      })
    });
    
    suite('PUT', function() {
      test('report reply', function(done) {

        //done();
      })
    });
    
    suite('DELETE', function() {
      test('delete reply with bad password', function(done) {

        //done();
      })

      test('delete reply with valid password', function(done) {

        //done();
      })
    });
    
  });

});
