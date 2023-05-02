const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = "Ajsdiry43bkdrf34";

const hashPassword = async(password)=>{
    let salt = bcrypt.genSaltSync(10);
    let hashedPassword = await bcrypt.hash(password,salt);
    return hashedPassword;
}

const hashCompare = async(password,hashedPassword)=>{
    return await bcrypt.compare(password,hashedPassword);
}

const createToken = async(payload)=>{
    let token = await jwt.sign(payload,secretKey,{expiresIn:'10m'});
    return token
}


const validate = async (req,res,next)=>{
    if(req.headers.authorization){
        let token = req.headers.authorization.split(" ")[1];
        let data = jwt.decode(token);
        if(Math.floor(+new Date()/1000) < data.exp){
            next();
        }else{
            res.status(402).send({
                message:"Token expired"
            })
        }
    }else{
        res.status(400).send({
            message:'token not found',
        })
    }
}

const roleAdminGuard = async (req,res,next)=>{
    if(req.headers.authorization){
        let token = req.headers.authorization.split(" ")[1];
        let data = jwt.decode(token);
        if(data.role ==="admin"){
            next();
        }else{
            res.status(402).send({
                message:"only admin allowed!"
            })
        }
    }else{
        res.status(400).send({
            message:'token not found',
        })
    }
}

const roleManagerAdminGuard = async (req,res,next)=>{
    if(req.headers.authorization){
        let token = req.headers.authorization.split(" ")[1];
        let data = jwt.decode(token);
        if(data.role ==="admin" || data.role === "manager"){
            next();
        }else{
            res.status(402).send({
                message:"only admin & Manager allowed!"
            })
        }
    }else{
        res.status(400).send({
            message:'token not found',
        })
    }
}
module.exports = {hashPassword,hashCompare,createToken,validate,roleAdminGuard,roleManagerAdminGuard};