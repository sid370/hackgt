const express = require("express");
const mongoose = require("mongoose");
const Router = express.Router();
const invUser = require("../models/inventory");
const checkAuth = require("../checkAuth")
const cookieParser = require("cookie-parser");

const invController = require("../controller/inventory");

const withAuthUserId = [
    cookieParser(),
    (req, res, next) => {
      const claims = jwt.verify(req.cookies['jwt'], "hms")
      req['authUserId'] = claims['sub'];
      req["expiry"] = claims["exp"];
      console.log(claims);
      req.id = claims["_id"];
      console.log(req.id);
      next()
    }
]


Router.post("/add",checkAuth, invController.add);

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

Router.get("/:batch_id",checkAuth, invController.trackBatch);

module.exports = Router;
