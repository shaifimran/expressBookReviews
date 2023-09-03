const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
  });

// Get the book list available in the shop
const axios = require('axios');

public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get("./booksdb.js"); // Replace with the actual URL to fetch the book data.
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books data' });
  }
});


// Get book details based on ISBN

public_users.get('/isbn/:isbn', function (req, res) {
  const requestedISBN = req.params.isbn;

  axios.get("./booksdb.js") // Replace with the actual URL to fetch the book data.
    .then((response) => {
      const books = response.data;
      const book = books[requestedISBN];

      if (!book) {
        return res.status(404).json({ message: 'Book with the provided ISBN not found.' });
      }

      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error fetching books data' });
    });
});

  


public_users.get('/author/:author', function (req, res) {
  const requestedAuthor = req.params.author;

  axios.get("./booksdb.js") // Replace with the actual URL to fetch the book data.
    .then((response) => {
      const books = response.data;
      const matchingBooks = books.filter((book) => book.author === requestedAuthor);

      if (matchingBooks.length === 0) {
        return res.status(404).json({ message: 'No books by the provided author found.' });
      }

      res.status(200).json(matchingBooks);
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error fetching books data' });
    });
});

  

// Get all books based on title

public_users.get('/title/:title', function (req, res) {
  const requestedTitle = req.params.title;

  axios.get("./booksdb.js") // Replace with the actual URL to fetch the book data.
    .then((response) => {
      const books = response.data;
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
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error fetching books data' });
    });
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    res.status(200).json(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
