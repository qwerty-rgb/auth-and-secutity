//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const md5 = require("md5");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/signDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);


app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const user1 = new User({
      email: req.body.username,
      password: hash
    });
    user1.save(function(err){
      if(err){
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = md5(req.body.password);

  User.findOne({email: username}, function(err,foundUser){
    if(err){
      console.log(err);
    } else {
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets");
        } else {
          res.redirect("/");
        }
      }
    }
  });

});












app.listen(3000, function(req, res){
  console.log("Server started on port 3000.");
});
