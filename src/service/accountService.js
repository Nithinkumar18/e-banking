
const account = require('../model/account');
const transactionService = require('../service/transactionService');
const opsdes = require('../constants/operationdes');
const opscns = require('../constants/operationstatus');

async function openNewAccount(acc_info) {
  try {
    const accn = generateAccountNo();
    acc_info.accountnumber = accn;
    const tdate = new Date();
    acc_info.opendate = tdate;
    const openaccount = await account.create(acc_info);
    if (openaccount) {
      return openaccount;
    }
    else {
      const open_acc_msg = { message: opsdes.OPEN_ACCOUNT_INFO, status: opscns.FAIL };
      return open_acc_msg;
    }
  }
  catch (err) {
    throw err;
  }
}

async function viewAccountInfo(cusId) {
  try {
    const account_details = await account.findOne({ custId: cusId });
    if (account_details) {
      return account_details;
    }
    else {
      const acc_msg = {
        message: opsdes.ACC_NOT_FOUND, status: opscns.FAIL
      }
      return acc_msg;
    }
  }
  catch (err) {
    throw err;
  }
}

async function withDraw(accno, amount) {
  let transfertype, transferto, status, transactiondate, account_no;
  const trasdate = new Date();
  try {
    const check_acc = await account.findOne({ accountnumber: accno });
    if (check_acc) {
      const _currentbalance = check_acc.balance;
      if (_currentbalance <= opsdes.MINIMUM_BALANCE_NUM || _currentbalance - amount < opsdes.MINIMUM_BALANCE_NUM) {
        const _minbalancemsg = { message: opsdes.MINIMUM_BALANCE, status: opscns.FAIL };
        return _minbalancemsg;
      }
      else {
        const _previousbalance = check_acc.balance;
        let _updatedbalance = _previousbalance - amount;
        const _updatebalance = await account.findOneAndUpdate({ accountnumber: accno }, { $set: { balance: _updatedbalance } }, { new: true });
        if (_updatebalance) {
          transfertype = opsdes.TRANSFER_D_TYPE;
          transferto = opsdes.TRANSFER_SELF_TYPE;
          status = opsdes.TRANSFER_STATUS;
          transactiondate = trasdate;
          account_no = accno;
          const _createTransaction = { amount, transfertype, transferto, status, transactiondate, account_no };
          const _transactionstatus = await transactionService.createTransaction(_createTransaction);
          if (_transactionstatus) {
            const transaction_id = _transactionstatus._id
            const _transfersuccessinfo = { transaction_id, amount, transfertype, transferto, status, transactiondate };
            return _transfersuccessinfo
          }

        }
        else {
          const amount = amount;
          transfertype = opsdes.TRANSFER_D_TYPE;
          transferto = opsdes.TRANSFER_SELF_TYPE;
          status = opsdes.TRANSFER_F_STATUS;
          transactiondate = trasdate;
          account_no = accno;
          const _withdrawfailtrans = { amount, transfertype, transferto, status, transactiondate, account_no };
          const _createfailtrans = await transactionService.createTransaction(_withdrawfailtrans);
          return _createfailtrans;
        }
      }
    }
    else {
      const _acc = { message: opsdes.ACC_NOT_FOUND, status: opsdes.FAIL_INFO };
      return _acc;
    }
  }
  catch (err) {
    throw err;
  }

}


async function depositAmount(accno, amount) {
  let transfertype, transferto, status, transactiondate, account_no;
  try {
    const valid_acc = await account.findOne({ accountnumber: accno });
    if (valid_acc) {
      const _currentbalance = valid_acc.balance;
      const _updatebalane = _currentbalance + amount;
      const deposit_amount = await account.findOneAndUpdate({ accountnumber: accno }, { $set: { balance: _updatebalane } });
      if (deposit_amount) {
        transfertype = opsdes.TRANSFER_C_TYPE;
        transferto = opsdes.TRANSFER_SELF_TYPE;
        status = opsdes.TRANSFER_STATUS;
        transactiondate = new Date();
        account_no = accno;
        const _deposit_transaction = { amount, transfertype, transferto, status, transactiondate, account_no };
        const create_transaction = await transactionService.createTransaction(_deposit_transaction);
        if (create_transaction) {
          const deposit_transactionid = create_transaction._id;
          const depost_success = { deposit_transactionid, amount, transfertype, transferto, status, transactiondate, account_no };
          return depost_success;
        }
      }
      else {
        transfertype = opsdes.TRANSFER_C_TYPE;
        transferto = opsdes.TRANSFER_SELF_TYPE;
        status = opsdes.TRANSFER_F_STATUS;
        transactiondate = new Date();
        account_no = accno;
        const unsucess_transaction = { amount, transfertype, transferto, status, transactiondate, account_no };
        const create_unsucess_entry = await transactionService.createTransaction(unsucess_transaction);
        return create_unsucess_entry;

      }
    }
    else {
      const acc_info = { message: opsdes.ACC_NOT_FOUND, status: opsdes.FAIL_INFO };
      return acc_info;
    }

  }
  catch (err) {
    throw err;
  }
}
function generateAccountNo() {
  const accno = Math.random().toString().slice(3, 13);
  return accno;
}

module.exports = {
  openNewAccount,
  viewAccountInfo,
  withDraw,
  depositAmount

}