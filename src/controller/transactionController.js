const express = require('express');
const router = express.Router();
const transactionService = require('../service/transactionService');
const accountService = require('../service/accountService');
const status_constants = require('../constants/operationstatus');
const status_info = require('../constants/operationdes');

router.get('/viewtransactions/:accno', async(req,res) => {
    try{
       const user_accountno = req.params.accno;
       const _transactions = await transactionService.getAllTransactions(user_accountno);
       
       if(_transactions.length > 0){
        return res.status(status_constants.SUCCESS).json({status:status_info.SUCCESS_INFO,_transactions});
       }
       else{
        return res.status(status_constants.SUCCESS).json({message:status_info.TRANSACTION_NOTFOUND,status:status_info.SUCCESS_INFO})
       }
    }
    catch(err){
       return res.status(status_constants.INTERNAL_SERVER_ERROR).json({status:status_info.ERROR_INFO,message:status_info.TRANSACTIONS_VIEW_ERROR,errdes:err.message});
    }
});


router.get('/customrangetransactions/:accno', async(req,res) => {
    try{
         const user_acn = req.params.accno;
         const {start_date,end_date} = req.query
         const validate_acno = await accountService.checkUser(user_acn);
         if(validate_acno){
         const transactions = await transactionService.customRangeTransactions(user_acn,start_date,end_date);

         if(transactions.length <= 0){
            return res.status(status_constants.SUCCESS).json({status:status_constants.SUCCESS,message:status_info.TRANSACTIONS_PERFORMED_PERIOD});
         }
         else if(transactions.status === status_info.FAIL_INFO){
            return res.status(status_constants.NOT_FOUND).json({status:status_info.FAIL_INFO,message:status_info.ACC_NOT_FOUND});
         }
         else{
            return res.status(status_constants.SUCCESS).json({status:status_info.SUCCESS_INFO,transactions});
         }
         }
         else{
            return res.status(status_constants.NOT_FOUND).json({status:status_info.FAIL_INFO,message:status_info.ACC_NOT_FOUND});
         }

    }
    catch(err){
         return res.status(status_constants.INTERNAL_SERVER_ERROR).json({status:status_info.ERROR_INFO,errdes:err.message})
    }
})

module.exports = router;