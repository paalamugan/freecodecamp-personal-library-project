/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const Book = require("../models/books");
const mongoose = require('mongoose');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {
    //Before starting the test, create a sandboxed database connection
    //Once a connection is established invoke done()
    before(function (done) {
      mongoose.connect(process.env.DB);
      const db = mongoose.connection;
      db.on('error', console.error.bind(console, 'connection error'));
      db.once('open', function() {
        console.log('We are connected to test database!');
        done();
      });
    });
    //After all tests are finished drop database and close connection
    after(function(done){
      mongoose.connection.db.dropDatabase(function(){
        mongoose.connection.close(done);
      });
    });

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({ title: "My title" })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.property(res.body, 'title', 'Book should contain title');
          done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({ title: "" })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.strictEqual(res.text, 'missing required field title');
          done();
        });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
          done();
        });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get(`/api/books/6360176f4bee5ca47083d500`)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.strictEqual(res.text, "no book exists");
          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        Book.find().then((books) => {
          chai.request(server)
          .get(`/api/books/${books[0]._id}`)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body, "response should be an object");
            done();
          });
        })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        Book.find().then((books) => {
          chai.request(server)
          .post(`/api/books/${books[0]._id}`)
          .send({comment: 'My comment'})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body, "response should be an object");
            done();
          });
        })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        Book.find().then((books) => {
          chai.request(server)
          .post(`/api/books/${books[0]._id}`)
          .send({comment: ''})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.strictEqual(res.text, "missing required field comment");
            done();
          });
        })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
        .post(`/api/books/6360176f4bee5ca47083d500`)
        .send({comment: 'My Comment'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.strictEqual(res.text, "no book exists");
          done();
        });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        Book.find().then((books) => {
          chai.request(server)
          .delete(`/api/books/${books[0]._id}`)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.strictEqual(res.text, "delete successful");
            done();
          });
        })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
        .delete(`/api/books/6360176f4bee5ca47083d6`)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.strictEqual(res.text, "no book exists");
          done();
        });
      });

    });

  });

});
