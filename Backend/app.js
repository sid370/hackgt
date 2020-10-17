const express = require("express")
const app=express()
const morgan=require("morgan")
const bodyParser=require("body-parser")
const cors=require("cors")
const mongoose=require("mongoose")
const login=require("./api/login")
const inventory=require("./api/inventory")

mongoose.connect("mongodb+srv://sid:v2FlOI7OuFwkDmdA@cluster0.l3dlu.mongodb.net/records?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname))
app.use(cors())
app.use("/auth", login);
app.use("/inventory",inventory)

app.use((req, res, next) => {
    res.status(404).json({
      status: 404,
      message: "Page not found",
    });
  });

module.exports=app;