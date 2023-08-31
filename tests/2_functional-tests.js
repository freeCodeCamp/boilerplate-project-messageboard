const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    let threadId = ""
    let replyId = ""
    suite('TEST /api/threads/{board}', function() {
        
        test('POST /api/threads/{board}', function(done) {
            chai.request(server)
            .keepOpen()
            .post('/api/threads/test')
            .send({
                text: "Test",
                password_string: "TestPassword"
            })
            .end(function(err, res) {
                assert.equal(res.status, 200)
                done()
            });
        });
        test('GET /api/threads/{board}', function(done) {
            chai.request(server)
            .keepOpen()
            .get('/api/threads/test')
            .end(function(err, res) {
                assert.equal(res.status, 200)
                assert.isArray(res.body);
                assert.isAtMost(res.body.length, 10)
                assert.property(res.body[0], 'replies')
                assert.isAtMost(res.body[0].replies.length, 3)
                threadId = res.body[0]._id
                done()
            });
        });
        test('DELETE /api/threads/{board} with invalid password', function(done) {
            chai.request(server)
            .keepOpen()
            .delete('/api/threads/test')
            .send({
                thread_id: threadId,
                delete_password: 'invalid password'
            })
            .end(function(err, res) {
                assert.equal(res.status, 200)
                assert.isString(res.body)
                assert.equal(res.body, 'incorrect password')
                done()
            });
        });
        test('DELETE /api/threads/{board} with valid password', function(done) {
            chai.request(server)
            .keepOpen()
            .delete('/api/threads/test')
            .send({
                thread_id: threadId,
                delete_password: 'TestPassword'
            })
            .end(function(err, res) {
                assert.equal(res.status, 200)
                assert.isString(res.body)
                assert.equal(res.body, 'success')
                done()
            });
        });
        test('POST /api/threads/{board}', function(done) {
            chai.request(server)
            .keepOpen()
            .delete('/api/threads/test')
            .send({
                thread_id: threadId
            })
            .end(function(err, res) {
                assert.equal(res.status, 200)
                assert.isString(res.body)
                assert.equal(res.body, 'reported')
                done()
            });
        });
    });
    suite("TEST /api/replies/{board}", function() {
        test('POST /api/replies/{board}', function(done) {
            chai.request(server)
            .keepOpen()
            .post('/api/replies/test')
            .send({
                thread_id: threadId,
                text: "Test",
                password_string: "TestPassword"
            })
            .end(function(err, res) {
                assert.equal(res.status, 200)
                done()
            });
        });
        test('GET /api/replies/{board}?thread_id={thread_id}', function(done) {
            chai.request(server)
            .keepOpen()
            .post('/api/replies/test')
            .query({
                "thread_id": threadId
            })
            .end(function(err, res) {
                let replies = []
                assert.equal(res.status, 200)
                assert.property(res.body, 'replies')
                assert.isArray(res.body.replies)
                replies = res.body.replies
                replies.forEach(element => {
                    assert.notProperty(element, 'reported')
                    assert.notProperty(element, 'delete_password')
                });
                replyId = replies[0].id
                done()
            });
        });
        test('DELETE /api/replies/{board} invalid delete password', function(done) {
            chai.request(server)
            .keepOpen()
            .delete('/api/replies/test')
            .send({
                thread_id: threadId,
                reply_id: replyId,
                password_string: "Invalid"
            })
            .end(function(err, res) {
                assert.equal(res.status, 200)
                assert.isString(res.body)
                assert.equal(res.body, 'incorrect password')
                done()
            });
        });
        test('DELETE /api/replies/{board} valid delete password', function(done) {
            chai.request(server)
            .keepOpen()
            .delete('/api/replies/test')
            .send({
                thread_id: threadId,
                reply_id: replyId,
                password_string: "TestPassword"
            })
            .end(function(err, res) {
                assert.equal(res.status, 200)
                assert.isString(res.body)
                assert.equal(res.body, 'success')
                done()
            });
        });
        test('PUT /api/replies/{board}', function(done) {
            chai.request(server)
            .keepOpen()
            .delete('/api/replies/test')
            .send({
                thread_id: threadId,
                reply_id: replyId
            })
            .end(function(err, res) {
                assert.equal(res.status, 200)
                assert.isString(res.body)
                assert.equal(res.body, 'reported')
                done()
            });
        });
    });
});
