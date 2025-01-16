
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Account = require('../model/account');
const transactionSchema = new Schema({

    amount:{
        type: Number,
        required: true
    },

    transfertype:{
        type: String,
        required: true
    },

    transferto:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true,
        
    },
    transactiondate:{
        type: Date,
        required: true
    },
    account_no:{
        type: String,
        required: true,
        ref: Account

    }

});

module.exports = mongoose.model("Transaction",transactionSchema);