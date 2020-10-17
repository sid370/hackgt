const mongoose = require("mongoose")
const UserSchema = mongoose.Schema({
    _id: String,
    email: { type: String, unique: true, match: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/ },
    name: { type: String },
    password: { type: String },
})

module.exports=mongoose.model('users',UserSchema)