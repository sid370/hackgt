const express = require("express");
const mongoose = require("mongoose");
const Router = express.Router();
const invUser = require("../models/inventory");
const checkAuth = require("../checkAuth")

Router.post("/add",checkAuth, (req, res, next) => {
    invUser.find({ batch_id: req.body.batch_id })
    .exec()
    .then((resp) => {
    console.log(resp)
      if (resp.length > 1) {
        res.status(500).json({
          status: 500,
          message: "Batch already in blockchain, Please try a new batch",
        });
      } else {
        const newUser = new invUser({
          _id: mongoose.Types.ObjectId(),
          batch_id: req.body.batch_id,
          quantity: req.body.quantity,
          value: req.body.value,
          man_date: req.body.man_date, 
          exp_date: req.body.exp_date, 
          location: req.body.location, 
          lat_long: req.body.lat_long, 
          recieved_on: req.body.recieved_on,
          dispatched_on: req.body.dispatched_on,
          item_class: req.body.item_class,
          damage: req.body.damage,
        });
        newUser
        .save()
        .then(resp=>{
            res.status(200).json({
                status: 200,
                message: "Created Successfully",
                data: resp
            })
        })
        .catch(err=>{
            res.status(500).json({
                status: 500,
                message: "Some error occured",
                error: err
            })
        })
      }
    });
});

Router.get("/",checkAuth,(req,res,next)=>{
    invUser.find()
    .select("batch_id quantity value recieved_on item_class damage")
    .exec()
    .then(resp=>{
        res.status(200).json({
            status: 200,
            count: resp.length,
            inventory: resp.map(item=>{
                return{
                    batch_id: item.batch_id,
                    quantity: item.quantity,
                    value: item.value,
                    recieved_on: item.recieved_on,
                    damage: item.damage
                }
            })
        })
    })
    .catch(err=>{
        res.status(500).json({
            status: 500,
            message: "Some error occured",
            error: err
        })
    })
})

Router.get("/:batch_id",checkAuth,(req,res,next)=>{
    invUser.find({batch_id: req.params.batch_id})
    .exec()
    .then(resp=>{
        if (resp){
            res.status(200).json({
                status: 200,
                batch_id: resp[0].batch_id,
                quantity: resp[0].quantity,
                value: resp[0].value,
                recieved_on: resp[0].recieved_on,
                damage: resp[0].damage
            })
        }
    })
    .catch(err=>{
        res.status(500).json({
            status: 500,
            message: "Some Error Occured",
            error: err
        })
    })
})

module.exports = Router;
