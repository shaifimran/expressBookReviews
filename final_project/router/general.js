const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
  
    // Check if the username already exists
    if (users.hasOwnProperty(username)) {
      return res.status(409).json({ message: "Username already exists. Please choose a different username." });
    }
  
    // Create a new user
    users[username] = password;
  
    return res.status(201).json({ message: "User registration successful." });
  });
  

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    res.status(200).json(books[req.params.isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const requestedAuthor = req.params.author;
    const matchingBooks = [];
  
    for (const bookId in books) {
      if (books.hasOwnProperty(bookId)) {
        const book = books[bookId];
        if (book.author === requestedAuthor) {
          matchingBooks.push(book);
        }
      }
    }
  
    if (matchingBooks.length === 0) {
      return res.status(404).json({ message: 'No books by the provided author found.' });
    }
  
    res.status(200).json(matchingBooks);
  });
  

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const requestedTitle = req.params.title;
    const matchingBooks = [];
  
    for (const bookId in books) {
      if (books.hasOwnProperty(bookId)) {
        const book = books[bookId];
        if (book.title === requestedTitle) {
          matchingBooks.push(book);
        }
      }
    }
  
    if (matchingBooks.length === 0) {
      return res.status(404).json({ message: 'No books by the provided title found.' });
    }
  
    res.status(200).json(matchingBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    res.status(200).json(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
