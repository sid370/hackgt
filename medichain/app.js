const express = require("express");
const app = express();
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const session = require("express-session");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const cookieparser = require("cookie-parser");
const Web3 = require("web3")
const upload = multer();
// const ethereum = require("ethereumjs-util");

app.use(morgan('dev')); // for personal use. Needs to be deleted


// app.use('/upload',express.static('upload'));
// app.set('views', './views');
// app.set('view engine', 'ejs');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
// app.use(cookieparser);
// app.use(passport.initialize());

app.use('/public', express.static('public'));

const window = {};
global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};

app.use(
  session({
    secret: "secret key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },

  })
);

//handling CORS error
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (res.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "POST,PUT,GET,DELETE,PATCH");
    res.status(200).json({});
  }

  next();
});

app.get("/", (req,res,next) => {
    App.load();
    res.status(200).json({
      message : "This is the home page. Currently under development"
    });
    // res.render("main");
  });
  
app.post("/", (req,res,next) => {
    res.status(200).json({
      message : "This is the home page. Currently under development"
    });
    // res.render("main");
  });

App = {
    loading: false,
    contracts: {},
    batchid : 0,
  
    load: async () => {
      await App.loadWeb3()
      await App.loadAccount()
      await App.loadContract()
      await App.render()
    },
  
    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    loadWeb3: async () => {
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider)
      } else {
        // window.alert("Please connect to Metamask.")
        console.log("Please Connect to MetaMask");
      }
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum)
        try {
          // Request account access if needed
          await ethereum.enable()
          // Acccounts now exposed
          web3.eth.sendTransaction({/* ... */})
        } catch (error) {
          // User denied account access...
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = web3.currentProvider
        window.web3 = new Web3(web3.currentProvider)
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */})
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    },
  
    loadAccount: async () => {
      // Set the current blockchain account
      App.account = Web3.eth.accounts[0];
      console.log(App.account);
    },
  
    loadContract: async () => {
      // Create a JavaScript version of the smart contract
      const meditran = await $.getJSON('Meditran.json')
      App.contracts.Meditran = TruffleContract(meditran)
      App.contracts.Meditran.setProvider(App.web3Provider)
  
      // Hydrate the smart contract with values from the blockchain
      App.meditran = await App.contracts.Meditran.deployed()
      console.log("Contract Loaded")
    },
  
};


app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
  });
  
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message,
      },
    });
  });
  
module.exports = app;