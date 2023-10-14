const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    let thread1Id = ""
    let thread2Id = ""
    let password1 = ""
    let password2 = ""
    let reply1Id = ""
    let reply2Id = ""
    let reply1Password = ""
    let reply2Password = ""
    suite('TEST /api/threads/{board}', function() {
        
        test('POST /api/threads/{board}', function(done) {
            chai.request(server)
            .keepOpen()
            .post('/api/threads/test')
            .send({
                text: "Test",
                delete_password: "TestPassword"
            })
            .end(function(err, res) {
                assert.equal(res.status, 200)
                thread1Id = res.body._id
                password1 = res.body.delete_password
            })
            chai.request(server)
            .keepOpen()
            .post('/api/threads/test2')
            .send({
                text: "Test2",
                delete_password: "Password"
            })
            .end(function(err, res) {
                assert.equal(res.status, 200)
                thread2Id = res.body._id
                password2 = res.body.delete_password
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
            });
            chai.request(server)
            .keepOpen()
            .get('/api/threads/test2')
            .end(function(err, res) {
                assert.equal(res.status, 200)
                assert.isArray(res.body);
                assert.isAtMost(res.body.length, 10)
                assert.property(res.body[0], 'replies')
                assert.isAtMost(res.body[0].replies.length, 3)
                done()
            });
        });
        test('DELETE /api/threads/{board} with invalid password', function(done) {
            chai.request(server)
            .keepOpen()
            .delete('/api/threads/test2')
            .send({
                thread_id: thread2Id,
                delete_password: 'invalid password'
            })
            .end(function(err, res) {
                assert.equal(res.status, 200)
                assert.isString(res.text)
                assert.equal(res.text, 'incorrect password')
                done()
            });
        });
        test('DELETE /api/threads/{board} with valid password', function(done) {
            chai.request(server)
            .keepOpen()
            .delete('/api/threads/test2')
            .send({
                thread_id: thread2Id,
                delete_password: password2
            })
            .end(function(err, res) {
                assert.equal(res.status, 200)
                assert.isString(res.text)
                assert.equal(res.text, 'success')
                done()
            });
        });
        test('PUT /api/threads/{board}', function(done) {
            chai.request(server)
            .keepOpen()
            .put('/api/threads/test')
            .send({
                thread_id: thread1Id
            })
            .end(function(err, res) {
                assert.equal(res.status, 200)
                assert.isString(res.text)
                assert.equal(res.text, 'reported')
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
                thread_id: thread1Id,
                text: "Test",
                delete_password: "TestPassword"
            })
            .end(function(err, res) {
                assert.equal(res.status, 200)
                reply1Id = res.body._id
                reply1Password = res.body.delete_password
            });
            chai.request(server)
            .keepOpen()
            .post('/api/replies/test')
            .send({
                thread_id: thread1Id,
                text: "another reply",
                delete_password: "pass"
            })
            .end(function(err, res) {
                assert.equal(res.status, 200)
                reply2Id = res.body._id
                reply2Password = res.body.delete_password
                done()
            });
        });
        test('GET /api/replies/{board}?thread_id={thread_id}', function(done) {
            chai.request(server)
            .keepOpen()
            .get('/api/replies/test')
            .query({
                "thread_id": thread1Id
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
                done()
            });
        });
        test('DELETE /api/replies/{board} invalid delete password', function(done) {
            chai.request(server)
            .keepOpen()
            .delete('/api/replies/test')
            .send({
                thread_id: thread1Id,
                reply_id: reply1Id,
                delete_password: "Invalid"
            })
            .end(function(err, res) {
                assert.equal(res.status, 200)
                assert.isString(res.text)
                assert.equal(res.text, 'incorrect password')
                done()
            });
        });
        test('DELETE /api/replies/{board} valid delete password', function(done) {
            chai.request(server)
            .keepOpen()
            .delete('/api/replies/test')
            .send({
                thread_id: thread1Id,
                reply_id: reply1Id,
                delete_password: reply1Password
            })
            .end(function(err, res) {
                assert.equal(res.status, 200)
                assert.isString(res.text)
                assert.equal(res.text, 'success')
                done()
            });
        });
        test('PUT /api/replies/{board}', function(done) {
            chai.request(server)
            .keepOpen()
            .put('/api/replies/test')
            .send({
                thread_id: thread1Id,
                reply_id: reply2Id
            })
            .end(function(err, res) {
                assert.equal(res.status, 200)
                assert.isString(res.text)
                assert.equal(res.text, 'reported')
                done()
            });
        });
    });
});
