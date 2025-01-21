
const account = require('../model/account');
const transactionService = require('../service/transactionService');
const opsdes = require('../constants/operationdes');
const opscns = require('../constants/operationstatus');

async function openNewAccount(acc_info) {
  try {
    const accn = generateAccountNo();
    acc_info.accountnumber = accn;
    const tdate = generateDate()
    acc_info.opendate = tdate;
    const openaccount = await account.create(acc_info);
    if (openaccount) {
      return openaccount;
    }
    else {
      const open_acc_msg = { message: opsdes.OPEN_ACCOUNT, status: opsdes.FAIL };
      return open_acc_msg;
    }
  }
  catch (err) {
    throw err;
  }
}

async function viewAccountInfo(accno) {
  try {
    const account_details = await checkUser(accno);
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
  const trasdate = generateDate()
  try {
    const check_acc = await checkUser(accno);
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
    const valid_acc = await checkUser(accno);
    if (valid_acc) {
      const _currentbalance = valid_acc.balance;
      const _updatebalane = _currentbalance + amount;
      const deposit_amount = await account.findOneAndUpdate({ accountnumber: accno }, { $set: { balance: _updatebalane } });
      if (deposit_amount) {
        transfertype = opsdes.TRANSFER_C_TYPE;
        transferto = opsdes.TRANSFER_SELF_TYPE;
        status = opsdes.TRANSFER_STATUS;
        transactiondate = generateDate()
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
        transactiondate = generateDate()
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


async function addBeneficiary(user_acc, beneficiary_info) {
  try {
    const validate_user = await checkUser(user_acc);
    if (validate_user) {
      const _beneficiaries = validate_user.beneficiaries;
      const verify_beneficiary = _beneficiaries.find(acc => acc.beneficiary_accno == beneficiary_info.beneficiary_accno);
      if (verify_beneficiary) {
        const _exists = {
          message: opsdes.BENEFICIARY_EXISTS_MSG,
          flag: true
        }
        return _exists;
      }
      else {
        const add_beneficiary = await account.findOneAndUpdate({ accountnumber: user_acc }, { $push: { beneficiaries: beneficiary_info } }, { new: true });
        const beneficiaries_data = add_beneficiary.beneficiaries
        return beneficiaries_data;
      }
    }
    else {
      const invalid_user = {
        message: opsdes.INVALID_USER, status: opsdes.FAIL_INFO
      }
      return invalid_user;
    }
  }
  catch (err) {

    throw err;
  }

}

async function removeBeneficiary(user_acc_no, beneficiary_acc_no) {

  try {
    const verify_user = await checkUser(user_acc_no);
    if (verify_user) {
      let beneficiaries_List = verify_user.beneficiaries;
      const fIndex = beneficiaries_List.find(beneficiary_a => beneficiary_a.beneficiary_accno === beneficiary_acc_no);
      const remove_beneficiary = await account.findOneAndUpdate({ accountnumber: user_acc_no }, { $pull: { beneficiaries: fIndex } }, { new: true });
      if (remove_beneficiary) {
        const updated_beneficiaries = remove_beneficiary.beneficiaries;
        return updated_beneficiaries;
      }
      else {
        const unlink_beneficiary = {
          message: opsdes.UNLINK_BENEFICIARY_FAIL,
          status: opsdes.FAIL_INFO,
          flag: true
        }
        return unlink_beneficiary;
      }

    }
    else {
      const user_acc = {
        message: opsdes.INVALID_USER_ACC,
        status: opsdes.FAIL_INFO
      }
      return user_acc;
    }

  }
  catch (err) {
    throw err;
  }
};


async function transferMoney(senderaccno, receiverreceiptent) {
  let transfertype, transferto, status, transactiondate, account_no;
  try {
    const receiptent_accno = receiverreceiptent.beneficiary_accno;
    const amount = receiverreceiptent.amount;
    const verify_user = await checkUser(senderaccno);
    if (verify_user) {
      const beneficiariesData = verify_user.beneficiaries;
      const check_beneficiary = beneficiariesData.find(allbeneficiaries => allbeneficiaries.beneficiary_accno === receiptent_accno)
      if (check_beneficiary) {
        const _scurrentbalance = verify_user.balance;
        const _updatebalance = _scurrentbalance - amount;
        const _setnewbalance = _scurrentbalance <= opsdes.MINIMUM_BALANCE_NUM || _updatebalance < opsdes.MINIMUM_BALANCE_NUM ? false : true;
        if (_setnewbalance) {
          const debit_sender = await account.findOneAndUpdate({ accountnumber: senderaccno }, { $set: { balance: _updatebalance } }, { new: true });
          if (debit_sender) {
            transfertype = opsdes.NEFT_TRANSFER,
              transferto = receiptent_accno,
              status = opsdes.NEFT_D_STATUS,
              transactiondate = generateDate()
              account_no = senderaccno
            const _maketransferinfo = { amount, transfertype, transferto, status, transactiondate, account_no };
            const _td = transactionService.createTransaction(_maketransferinfo);
            const _receiverinfo = await viewAccountInfo(receiptent_accno);
            const _depositmoney = _receiverinfo.balance;
            const _updaterbalance = _depositmoney + amount;
            const _setnewbalancer = await account.findOneAndUpdate({ accountnumber: receiptent_accno }, { $set: { balance: _updaterbalance } }, { new: true });
            transfertype = opsdes.NEFT_TRANSFER,
              transferto = opsdes.RECEIVE_NEFT,
              status = opsdes.NEFT_C_STATUS,
              transactiondate = generateDate()
            account_no = receiptent_accno;
            const _makeneftobj = { amount, transfertype, transferto, status, transactiondate, account_no };
            const _ts = transactionService.createTransaction(_makeneftobj);
            return _maketransferinfo;
          }
        }
        else {
          const transaction_restricted = {
            message: opsdes.MINIMUM_BALANCE,
            status: opsdes.FAIL_INFO
          }
          return transaction_restricted;
        }
      }
      else {
        const invalid_beneficiary = {
          message: opsdes.BENEFICIARY_NOTFOUND,
          status: opsdes.FAIL_INFO
        }
        return invalid_beneficiary;
      }
    }
    else {
      const _msg = { message: opsdes.ACC_NOT_FOUND, status: opsdes.FAIL_INFO };
      return _msg;
    }
  }
  catch (err) {
    throw err;
  }
}

async function checkUser(accn){
  return await account.findOne({accountnumber:accn});
}
function generateAccountNo() {
  const accno = Math.random().toString().slice(3, 13);
  return accno;
}

function generateDate(){
  const present_date = new Date()
  const _month = present_date.getMonth() + 1;
  const _year = present_date.getFullYear();
  const _date = present_date.getDate();
  const _datereturn = `${_year}-${_month < 10 ? '0' + _month : _month}-${_date < 10 ? '0' + _date : _date}`;
  return _datereturn;
}

module.exports = {
  openNewAccount,
  viewAccountInfo,
  withDraw,
  depositAmount,
  addBeneficiary,
  removeBeneficiary,
  transferMoney,
  checkUser

}