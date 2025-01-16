const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require("./user")
const accountSchema = new Schema({

    accountnumber:{
        type: String,
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

    PAN:{
        type: String,
        required: true
    },

    opendate:{
        type: Date,
        required: true,
    },
   beneficiaries: [],

    custId:{
        type: Number,
        ref: User
    }


});

module.exports = mongoose.model("Account", accountSchema);