
const express = require('express');
const userService = require('../service/userService');
const router = express.Router();
const status_constants = require('../constants/operationstatus');
const operation_info = require('../constants/operationdes');
const {validateToken} = require('../middleware/authorise');


router.get('/myinfo/:cust_id', validateToken, async(req, res) => {
    try {
        const id = req.params.cust_id;
        const userRes = await userService.viewUserInfo(id);
        if (userRes.status) {
            return res.status(status_constants.NOT_FOUND).json(userRes);
        }
        else {

            const { username, email, address } = userRes;
            const user_profile = { username, email, address };
            return res.status(status_constants.SUCCESS).json({ status: operation_info.SUCCESS_INFO, user_profile });
        }
    }
    catch (err) {
        return res.status(status_constants.INTERNAL_SERVER_ERROR).json({message: operation_info.VIEW_USER_INFO_ERR , status: operation_info.ERROR_INFO, errdes: err.message})
    }
});


router.post('/register', async(req,res) =>{
   
    let userReges = req.body;
    try{
      const ops_regs = await userService.regesterUser(userReges);
      if(ops_regs){
        return res.status(status_constants.RECORD_CREATED).json({message: operation_info.USER_REGESTERED,status: operation_info.SUCCESS_INFO,customerId: ops_regs.custId});
      }
      else{
        return res.status(status_constants.FAIL).json({message:operation_info.USER_REGES_FAIL,status:operation_info.FAIL_INFO });
      }
    }
    catch(err){
      
       return res.status(status_constants.INTERNAL_SERVER_ERROR).json({message: operation_info.USER_REGES_FAIL,status: operation_info.ERROR_INFO, errdes: err.message});
    }
});


router.put('/updateinfo/:custid',validateToken, async(req,res) => {
    try{
      const customer_id = req.params.custid;
      const update_data = req.body;
      const update_res = await userService.updateMyInfo(customer_id,update_data);
      if(!update_res.status){
        return res.status(status_constants.SUCCESS).json({message:operation_info.USER_INFO_UPDATE, status: operation_info.SUCCESS_INFO});
      }
      else{
        return res.status(status_constants.FAIL).json({message:operation_info.INVALID_USER, status: operation_info.FAIL_INFO})
      }
    }
    catch(err){
       return res.status(status_constants.INTERNAL_SERVER_ERROR).json({message:operation_info.USER_INFO_FAIL, status:operation_info.ERROR_INFO, errdes: err.message});
    }
});


router.delete('/unregister/:cusId', validateToken, async(req,res) => {
    try{
      const id = req.params.cusId;
      const unregister_user = await userService.deleteMyAcc(id);
      if(!unregister_user.status){
        return res.status(status_constants.SUCCESS).json({message:operation_info.USER_UNREGISTER_SUCCESS, status:operation_info.SUCCESS_INFO});
      }
      else{
        return res.status(status_constants.NOT_FOUND).json({message:operation_info.INVALID_USER,status:operation_info.FAIL_INFO});
      }
    }
    catch(err){
       return res.status(status_constants.INTERNAL_SERVER_ERROR).json({message:operation_info.USER_UNREGISTER, status:operation_info.ERROR_INFO,errdes:err.message})
    }
})


router.post('/login', async(req,res) => {
    try{
      const email = req.body.email;
      const password = req.body.password;
      const validate = await userService.login(email,password);
      if(validate.status){
        return res.status(status_constants.UNAUTHORISED_REQUEST).json({message:validate.opsdes,status:validate.status})
      }
      else{
        return res.status(status_constants.SUCCESS).json({token:validate});
      }
    }
    catch(err){
       return res.status(status_constants.INTERNAL_SERVER_ERROR).json({message:operation_info.USER_LOGIN_FAILED,status:operation_info.ERROR_INFO,errdes:err.message});
    }
})
module.exports = router;