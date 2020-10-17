const express=require("express")
const Router=express.Router()
const controller=require("../controller/login")

Router.post('/signup',controller.signup)
Router.post('/login',controller.login)

module.exports=Router