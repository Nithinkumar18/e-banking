
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const accountController = require('./src/controller/accountController');
const userController = require('./src/controller/userController');
const transactionController = require('./src/controller/transactionController');

dotenv.config();
app.use(express.json());
app.use('/api/user',userController);
app.use('/api/account',accountController);
app.use('/api/transaction',transactionController);
const connectTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit'});
 mongoose.connect('mongodb://localhost:27017/e-banking', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        app.listen(8080);
        console.log(`Connected to DB and app running on PORT ${process.env.PORT}`);
        console.log(`connection time: ${connectTime}`);
    })
    .catch(err => {
        console.log("error connecting to DB", err);
    });