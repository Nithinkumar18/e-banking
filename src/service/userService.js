
const user = require('../model/user');
const crypto = require('crypto');
const ops_des = require('../constants/operationdes');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

async function regesterUser(userdata){
    try{
     const  cid = userdata.custId;
     const beencypt = userdata.password;
     const createcstId = createCustId(cid);
     const encryptpass = encryptPassword(beencypt);
     userdata.custId = createcstId;
     userdata.password = encryptpass;
     const createdUser = await user.create(userdata);
     return createdUser;
    }
    catch(err){
      throw err;
    }
}


async function viewUserInfo(customerId){
    try{
      const userInfo = await user.findOne({custId:customerId});
      if(userInfo){
          return userInfo
      }
      else{
          const message = { opsdes:ops_des.INVALID_USER ,status: ops_des.FAIL_INFO}
          return message ;
      }
    }
    catch(err){
        throw err;
    }
}

 async function updateMyInfo(custId,userupdateinfo){
    try{
      const userdetailsupdate = await user.findOneAndUpdate({custId:custId}, {$set: userupdateinfo}, {new: true});
      if(userdetailsupdate){
      return userdetailsupdate;
      }
      else{
          const response_msg = { opsdes:ops_des.INVALID_USER,status:ops_des.FAIL_INFO}
          return response_msg;
      }
    }
    catch(err){
      throw err;
    }
 } 

 async function deleteMyAcc(cusId){
    try{
      const closeacc = await user.findOneAndDelete({custId: cusId});
      if(closeacc){
      return closeacc;
      }
      else{
          const msg = { opsdes: ops_des.INVALID_USER,status: ops_des.FAIL_INFO}
          return msg;
      }
    }
    catch(err){
        throw err;
    }
 }

 async function login(useremail, userpassword){
    try{
        const user_encpass = encryptPassword(userpassword);
        const valid_user = await user.findOne({$and: [{email: useremail, password: user_encpass}]});
        if(valid_user){
            const email = valid_user.email
           const _token =  jwt.sign({email},process.env.SECRETKEY,{expiresIn: '900s'});
           return _token;
        }
        else{
            const unauthorized_user = {opsdes: ops_des.USER_CREDENTIALS_INVALID, status:ops_des.FAIL_INFO};
            return unauthorized_user;
        }
    }
    catch(err){
        throw err;
    }
 }

const createCustId = () => {
    const cstId = Math.random().toString().slice(3,9);
    return cstId;
}

const encryptPassword = (passStr) => {
    const encpass = crypto.createHash('sha256').update(passStr).digest('hex');
    return encpass;
}

module.exports = {
    regesterUser,
    viewUserInfo,
    updateMyInfo,
    deleteMyAcc,
    login
}

