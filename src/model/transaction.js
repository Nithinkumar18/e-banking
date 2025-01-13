
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

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
        type: Number,
        required: true
    },
    status:{
        type: String,
        required: true,
        
    },
    transactiondate:{
        type: Date,
        required: true
    }

});

module.exports = mongoose.model("Transaction",transactionSchema);