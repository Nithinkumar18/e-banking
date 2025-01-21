
const operation_description = require('../constants/operationdes');
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


async function getAllTransactions(accountno){
  try{
    const transactionList = await transaction.find({account_no:accountno});

    return transactionList;
  }
  catch(err)
  {
    throw err;
  }
}

async function customRangeTransactions(accountno,start_date,end_date){
 
   let fromdate,todate;
  try{
    fromdate = new Date(start_date + "T00:00:00Z");
    todate = new Date(end_date + "T23:59:59.999Z");
    const view_transactions = await transaction.find({
      account_no: accountno,
      transactiondate: {
          $gte: fromdate,
          $lte: todate
      }
  });
     return view_transactions;
}
  
  catch(err){
    throw err;
  }
}


module.exports = {
    createTransaction,
    getAllTransactions,
    customRangeTransactions
}