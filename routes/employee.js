var express = require('express');
var router = express.Router();
const {managerModel} = require('../schemas/managerSchema');
const {employeeModel} = require('../schemas/employeeSchema');
const mongoose = require('mongoose');
const {hashPassword,hashCompare,createToken,validate,roleManagerAdminGuard} = require('../common/auth');
const {dbURL} = require('../common/dbConfig');
mongoose.connect(dbURL);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resources');
});

router.post('/login',async(req,res,next)=>{
  try{
    let manager = await employeeModel.findOne({email:req.body.email})
    if(manager){
      if(await hashCompare(req.body.password,manager.password)){
        let token = await createToken({
          name:manager.name,
          email:manager.email,
          id:manager._id,
          role:manager.role
        })
        res.status(200).send({
          message:"Employee Login successfully",
          token
        })
      }else{
        res.status(402).send({
          message:'Invalid Credential'
        })
      }
    }else{
      res.status(400).send({
        message:'your not an employee!'
      })
    }
  }catch(err){
    res.status(500).send({
      message : 'Internal server error',
      err
    })
  }
})

module.exports = router;
