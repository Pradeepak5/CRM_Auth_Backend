var express = require('express');
var router = express.Router();
const {managerModel} = require('../schemas/managerSchema');
const {employeeModel} = require('../schemas/employeeSchema');
const mongoose = require('mongoose');
const {hashPassword,hashCompare,createToken,validate,roleManagerAdminGuard} = require('../common/auth');
const {dbURL} = require('../common/dbConfig');
mongoose.connect(dbURL);

router.get('/', function(req, res, next) {
  res.send('respond with a resources');
});

router.get('/employee',validate,roleManagerAdminGuard,async function(req, res, next) {
  try{
    let employee = await employeeModel.find();
    res.send({
      employee,
      message:'data fetched successfully'
    });
  }catch(err){
    res.send({
      message:"internal server error",
      err
    })
  }
});

router.post('/login',async(req,res,next)=>{
  try{
    let manager = await managerModel.findOne({email:req.body.email})
    if(manager){
      if(await hashCompare(req.body.password,manager.password)){
        let token = await createToken({
          name:manager.name,
          email:manager.email,
          id:manager._id,
          role:manager.role
        })
        res.status(200).send({
          message:"Manager Login successfully",
          token
        })
      }else{
        res.status(402).send({
          message:'Invalid Credential'
        })
      }
    }else{
      res.status(400).send({
        message:'your are not manager!'
      })
    }
  }catch(err){
    res.status(500).send({
      message : 'Internal server error',
      err
    })
  }
})

router.post('/addemployee', async(req,res)=>{
  try{
    let manager = await  employeeModel.findOne({email:req.body.email})
    if(!manager){
      let hashedPassword = await hashPassword(req.body.password);
      req.body.password = hashedPassword;
      let manager = await employeeModel.create(req.body);
      res.status(201).send({
        message:"Employee created successfully",
        hashedPassword
      })
    }else{
      res.status(400).send({
        message:'Employee already exists!'
      })
    }
  }catch(err){
    console.log(err)
    res.status(500).send({
      message : 'Internal server error',
      err
    })
  }
})

module.exports = router;
