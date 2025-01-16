
const jwt = require('jsonwebtoken');
const status_code = require('../constants/operationstatus');
const operation_info = require('../constants/operationdes');
const dotenv = require('dotenv');
dotenv.config();

const key = process.env.SECRETKEY;
 async function validateToken(req,res,next) {

    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer')){
            return res.status(status_code.UNAUTHORISED_REQUEST).json({message: operation_info.INVALID_TOKEN_FORMAT, status:operation_info.FAIL_INFO});
        }
        const _token =  authHeader.split(" ")[1]
        const validate_token = jwt.verify(_token,key);
        next();
        

    }
    catch(err){
    if (err.name === 'TokenExpiredError') {
        return res
            .status(status_code.UNAUTHORISED_REQUEST)
            .json({ message: operation_info.TOKEN_EXPIRED, status: operation_info.FAIL_INFO });
    }

    // Handle other errors
    return res
        .status(status_code.INTERNAL_SERVER_ERROR)
        .json({ message: operation_info.TOKEN_VALIDATION_FAILED, status: operation_info.ERROR_INFO, errdes: err.message });
}
    }
    


module.exports = {
    validateToken
}
