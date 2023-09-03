const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
   if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization?.username;
  
    if (!username) {
      return res.status(403).json({ message: "User not authenticated" });
    }
  
    if (!review) {
      return res.status(400).json({ message: "Review is required" });
    }
  
    // Check if the book with the given ISBN exists in your database (booksdb.js)
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Check if the book has reviews; if not, initialize it as an empty array
    if (!books[isbn].reviews || !Array.isArray(books[isbn].reviews)) {
      books[isbn].reviews = [];
    }
  
    // Check if the user has already posted a review for this ISBN
    const existingReviewIndex = books[isbn].reviews.findIndex((entry) => entry.username === username);
  
    if (existingReviewIndex !== -1) {
      // Update the existing review
      books[isbn].reviews[existingReviewIndex].review = review;
      return res.status(200).json({ message: "Review updated successfully" });
    } else {
      // Add a new review
      books[isbn].reviews.push({ username, review });
      return res.status(200).json({ message: "Review added successfully" });
    }
  });
  
  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization?.username;
  
    if (!username) {
      return res.status(403).json({ message: "User not authenticated" });
    }
  
    // Check if the book with the given ISBN exists in your database (booksdb.js)
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Check if the book has reviews; if not, there's nothing to delete
    if (!books[isbn].reviews || !Array.isArray(books[isbn].reviews)) {
      return res.status(404).json({ message: "No reviews found for this book" });
    }
  
    // Find the index of the review with the matching username
    const reviewIndex = books[isbn].reviews.findIndex((entry) => entry.username === username);
  
    if (reviewIndex !== -1) {
      // Remove the review at the found index
      books[isbn].reviews.splice(reviewIndex, 1);
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      // No matching review found
      return res.status(404).json({ message: "Review not found" });
    }
  });
  
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
