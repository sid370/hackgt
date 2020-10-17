const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((resp) => {
      if (resp.length > 1) {
        return res.status(500).json({
          status: 500,
          message: "Username Unavailable",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              status: 500,
              message:
                "Some error ocurred. Please Change the password and try again",
              password: req.body.password,
              err: err,
            });
          } else {
            const newUser = new User({
              _id: mongoose.Types.ObjectId(),
              name: req.body.name,
              email: req.body.email,
              password: hash,
            });
            newUser
              .save()
              .then((resp) => {
                res.status(200).json({
                  status: 200,
                  message: "Created Successfully",
                });
              })
              .catch((err) => {
                res.status(500).json({
                  status: 500,
                  message: "Some Error Occurred",
                  err: err,
                });
              });
          }
        });
      }
    });
};

exports.login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((resp) => {
      if (resp.length < 1) {
        res.status(404).json({
          status: 404,
          message: "Account Not Found",
        });
      } else {
        bcrypt.compare(req.body.password, resp[0].password, (err, response) => {
          if (err)
            res
              .status(500)
              .json({ status: 500, message: "Authentication Failed" });
          else if (response) {
            const token = jwt.sign(
              { email: resp[0].email, date: Date.now() },
              "secure12@3",
              { expiresIn: "1h" }
            );
            return res.status(200).json({
              status: 200,
              message: "login successful",
              token: token,
            });
          } else {
            res.status(500).json({
              status: 500,
              message: "Incorrect Password",
            });
          }
        });
      }
    })
    .catch((err) => res.status(500).json({ status: 500, err: err }));
};
