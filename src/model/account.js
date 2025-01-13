const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require("./user")
const accountSchema = new Schema({

    accountnumber:{
        type: Number,
        required: true,
        min: 10,
        max: 10
    },

    balance:{
        type: Number,
        required: true
    },

    accounttype:{
        type:String,
        required: true
    },

    panno:{
        type: String,
        required: true
    },

    opendate:{
        type: Date,
        required: true,
    },
   beneficiaries: [],

    cusId:{
        type: Number,
        ref: "User"
    }


});

module.exports = mongoose.model("Account", accountSchema);