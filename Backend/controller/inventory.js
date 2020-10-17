const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const invUser = require("../models/inventory");
const cry = require('crypto-js');
const SHA256 = cry.SHA256;

const crypto = require("crypto");
const sha1 = require("sha1");


exports.add = (req,res,next) => {
    invUser.find({ batch_id: req.body.batch_id })
    .exec()
    .then((resp) => {
    console.log(resp)
      if (resp.length < 1) {
        // res.status(500).json({
        //   status: 500,
        //   message: "Batch already in blockchain, Please try a new batch",
        // });
        var previousHash = 'New Block';
      } else {
        var previousHash = resp[resp.length - 1].hash.toString();

      } 
    console.log("Adding to the DB...")
    console.log(previousHash);
    var id = new mongoose.Types.ObjectId().toString();
    console.log(id);
    var hash = crypto.createHash("md5").update(previousHash+id+req.body.batch_id.toString()+req.body.name+req.body.vendorID.toString()+req.body.vendorName+req.body.quantity.toString()+req.body.value.toString()+req.body.man_date.toString()+req.body.exp_date.toString()+req.body.location+req.body.lat_long+req.body.recieved_on.toString()+req.body.dispatched_on.toString()+req.body.item_class+req.body.damage).digest("hex");
    const newInv = new invUser({
            previousHash : previousHash,
            hash : hash,
            // hash = SHA256(previousHash+id+req.body.batch_id.toString()+req.body.name+req.body.vendorID.toString()+req.body.vendorName+req.body.quantity.toString()+req.body.value.toString()+req.body.man_date.toString()+req.body.exp_date.toString()+req.body.location+req.body.lat_long+req.body.recieved_on.toString()+req.body.dispatched_on.toString()+req.body.item_class+req.body.damage).toString(),
            _id: id,
            batch_id: req.body.batch_id,
            vendorID : req.body.vendorID,
            vendorName : req.body.vendorName,
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
        newInv
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
                error: err.message
            })
        })
    });
};

function createHash(obj){
    for(var key in obj){
        if(key !== hash){

        }
    }
}

exports.trackBatch = (req,res,next) => {
    invUser.find({batch_id : req.params.batch_id}).exec()
    .then(result => {
        if(result < 1){
            console.log("No item for this batch");
        } else {
            var prevHash = "New Block";
            var broken = false;
            for(var i = 0;i<result.length;i++){
                if(prevHash !== result[i].previousHash){
                    broken = true;
                }
                const hash = crypto.createHash("md5").update(result[i].previousHash+ result[i]._id+result[i].vendorID+result[i].vendorName+result[i].batch_id+result[i].quantity+result[i].value+result[i].man_date+result[i].exp_date+result[i].location+result[i].lat_long+result[i].recieved_on+result[i].dispatched_on+result[i].item_class+result[i].damage).digest("hex");
                hash = SHA256(result[i].previousHash+ result[i]._id+result[i].vendorID+result[i].vendorName+result[i].batch_id+result[i].quantity+result[i].value+result[i].man_date+result[i].exp_date+result[i].location+result[i].lat_long+result[i].recieved_on+result[i].dispatched_on+result[i].item_class+result[i].damage).toString();
                if(hash !== result[i].hash){
                    broken = true;
                }

                prevHash = hash;
            }

            res.status(200).json({
                result : result,
                broken : broken
            });
        }
    })
    .catch(err => {
        res.status(404).json({
            error : err.message
        });
    });
}

exports.track = (req,res,next) => {
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
}