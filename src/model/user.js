const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({


    custId:{
        type: Number,
        required: true,
        min: 6,
        max: 6
    },
    username:{
        type: String,
        required: true,
    },

    email:{
        type: String,
        required: true
    },

    password:{
        type: String,
        required: true
    },

    address:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model("User",userSchema);