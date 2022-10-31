/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const Book = require("../models/books");

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      let books = await Book.find();
      books = books.map((book) => {
        book = book.toObject();
        book.commentcount = book.comments.length;
        return book;
      })
      res.json(books);
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(async function (req, res){
      const title = req.body.title;
      if (!title) {
        return res.send("missing required field title");
      }
      const result = {
        title: title
      }
      const book = await Book.create(result);
      res.json(book);
      //response will contain new book object including atleast _id and title
    })
    
    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'
      try {
        await Book.deleteMany()
        res.send("complete delete successful")
      } catch (err) {
        res.send(err.message)
      }
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookId = req.params.id;
      const book = await Book.findById(bookId);
      if (!book) {
        return res.send("no book exists");
      }
      res.json(book);
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(async function(req, res){
      let bookId = req.params.id;
      let comment = req.body.comment;
      if (!comment) {
        return res.send("missing required field comment");
      }

      const book = await Book.findById(bookId);
      if (!book) {
        return res.send("no book exists");
      }
      book.comments.push(comment);
      await book.save();
      res.json(book);
      //json res format same as .get
    })
    
    .delete(async function(req, res){
      let bookId = req.params.id;
      try {
        await Book.findByIdAndRemove(bookId);
        res.send("delete successful");
      } catch (err) {
        res.send("no book exists");
      }
      //if successful response will be 'delete successful'
    });
  
};
