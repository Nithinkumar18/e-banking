
const transaction = require('../model/transaction');


async function createTransaction(transaction_data){
    try{
      const new_transaction = await transaction.create(transaction_data);
      return new_transaction; 
    }
    catch(err){
      throw err;
    }
}


module.exports = {
    createTransaction
}