//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const encrypt = require('mongoose-encryption');


const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

const secret = "Thisisourlittlesecret.";
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/home", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  const user1 = new User ({
    email: req.body.username,
    password: req.body.password
  });
  user1.save(function(err){
    if(err){
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if(err){
      console.log(err);
    } else {
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets");
        } else {
          res.render("/");
        }
      }
    }
  });
});

app.get("/login", function(req, res){
  res.render("login");
});

app.listen(4000, function(req, res){
  console.log("Server started at port 4000.");
});
