const express = require('express');
const router = express.Router();
const accountService = require('../service/accountService');
const ops_des = require('../constants/operationdes');
const status_cns = require('../constants/operationstatus');
const { validateToken } = require('../middleware/authorise');

router.get('/accinfo/:customer_id', validateToken, async (req, res) => {
   try {
      const cst_id = req.params.customer_id;
      const user_acc_info = await accountService.viewAccountInfo(cst_id);
      if (user_acc_info.status) {
         return res.status(status_cns.NOT_FOUND).json({ message: ops_des.ACC_NOT_FOUND, status: ops_des.FAIL_INFO });
      }
      else {
         return res.status(status_cns.SUCCESS).json({ status: ops_des.SUCCESS_INFO, user_acc_info });
      }
   }
   catch (err) {
      return res.status(status_cns.INTERNAL_SERVER_ERROR).json({ message: ops_des.ACC_ERR_INFO, status: ops_des.ERROR_INFO, errdes: err.message });
   }
});


router.post('/openaccount', validateToken, async (req, res) => {
   try {
      const acc_data = req.body;
      const open_acc = await accountService.openNewAccount(acc_data);
      if (open_acc.status) {
         return res.status(status_cns.FAIL).json({ message: open_acc.message, status: open_acc.status });
      }
      else {
         return res.status(status_cns.RECORD_CREATED).json({ status: status_cns.SUCCESS, message: ops_des.OPEN_ACCOUNT_INFO, ACCOUNTNO: open_acc.accountnumber });
      }
   }
   catch (err) {
      return res.status(status_cns.INTERNAL_SERVER_ERROR).json({ message: ops_des.ACC_CRTE_ERR, status: ops_des.ERROR_INFO, errdes: err.message });
   }
})


router.put('/withdraw/:accno', async (req, res) => {
   try {
      const ac_no = req.params.accno;
      const transamount = req.body.amount;
      const success_status = ops_des.TRANSFER_STATUS
      const withdraw_statement = await accountService.withDraw(ac_no, transamount);
      if (withdraw_statement.status == success_status) {

         return res.status(status_cns.SUCCESS).json({ Transaction_Acknoweldgement: ops_des.TRANSACTION_WITHDRAW_SUCCESS, withdraw_statement });
      }
      else {
         return res.status(status_cns.SUCCESS).json({ Transaction_Acknoweldgement: ops_des.TRANSACTION_WITHDRAW_FAIL, withdraw_statement });
      }
   }
   catch (err) {
      return res.status(status_cns.INTERNAL_SERVER_ERROR).json({ message: ops_des.TRANSACTION_WITHDRAW_FAIL, status: ops_des.ERROR_INFO, errdes: err.message });
   }
});


router.put('/deposit/:accno', async (req, res) => {
   try {
      const ac_no = req.params.accno;
      const deposit_amount = req.body.amount;
      const deposit_status = ops_des.TRANSFER_STATUS;
      const deposit_statement = await accountService.depositAmount(ac_no, deposit_amount);
      if (deposit_statement.status === deposit_status) {
         return res.status(status_cns.SUCCESS).json({ Transaction_Acknoweldgement: ops_des.TRANSACTION_DEPOSIT_SUCCESS, deposit_statement })
      }
      else {
         return res.status(status_cns.FAIL).json({ Transaction_Acknoweldgement: ops_des.TRANSACTION_DEPOSIT_FAIL, deposit_statement })
      }

   }
   catch (err) {
      return res.status(status_cns.INTERNAL_SERVER_ERROR).json({ message: ops_des.TRANSACTION_DEPOSIT_FAIL, status: ops_des.ERROR_INFO, errdes: err.message });
   }
})

module.exports = router;