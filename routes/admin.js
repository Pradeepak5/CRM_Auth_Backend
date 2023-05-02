var express = require('express');
var router = express.Router();
const {adminModel} = require('../schemas/adminSchemas');
const {managerModel} = require('../schemas/managerSchema');
const {employeeModel} = require('../schemas/employeeSchema');
const mongoose = require('mongoose');
const {hashPassword,hashCompare,createToken,validate, roleAdminGuard, roleManagerAdminGuard} = require('../common/auth');
const {dbURL} = require('../common/dbConfig');
mongoose.connect(dbURL);


router.post('/addmanager',async(req,res)=>{
    try{
      let user = await  managerModel.findOne({email:req.body.email})
      if(!user){
        let hashedPassword = await hashPassword(req.body.password);
        req.body.password = hashedPassword;
        let user = await managerModel.create(req.body);
        res.status(201).send({
          message:"manager created successfully",
          hashedPassword
        })
      }else{
        res.status(400).send({
          message:'manager already exists!'
        })
      }
    }catch(err){
      res.status(500).send({
        message : 'Internal server error',
        err
      })
    }
  })

  router.post('/addemployee',async(req,res)=>{
    try{
      let user = await  employeeModel.findOne({email:req.body.email})
      if(!user){
        let hashedPassword = await hashPassword(req.body.password);
        req.body.password = hashedPassword;
        let user = await employeeModel.create(req.body);
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
      res.status(500).send({
        message : 'Internal server error',
        err
      })
    }
  })

router.post('/signup',async(req,res)=>{
  try{
    let user = await   managerModel.findOne({email:req.body.email})
    if(!user){
      let hashedPassword = await hashPassword(req.body.password);
      req.body.password = hashedPassword;
      let user = await adminModel.create(req.body);
      res.status(201).send({
        message:"signedUp successfully",
        hashedPassword
      })
    }else{
      res.status(400).send({
        message:'admin already exists!'
      })
    }
  }catch(err){
    res.status(500).send({
      message : 'Internal server error',
      err
    })
  }
})

router.get('/',validate,roleAdminGuard,async function(req, res, next) {
  try{
    let manager = await managerModel.find();
    res.send({
      manager,
      message:'data fetched successfully'
    });
  }catch(err){
    res.send({
      message:"internal server error",
      err
    })
  }
});

router.get('/:id',validate,roleAdminGuard,async function(req, res, next) {
  try{
    let manager = await managerModel.findOne({_id:req.params.id});
    res.send({
      manager,
      message:'data fetched successfully'
    });
  }catch(err){
    res.send({
      message:"internal server error",
      err
    })
  }
});

router.delete('/:id', async (req,res,next)=>{
  try{
    let manager = await managerModel.findOne({_id:req.params.id});
    if(manager){
      let manager = await managerModel.deleteOne({_id:req.params.id});
      res.send({
        message:'Manager deleted successfully'
      })
    }else{
      res.send({
        message:"Manager does not exixt"
      })
    }
  }catch(err){
    res.status(500).send({
      message:'Internal server error',
      err
    })
  }
})

router.delete('/employee/:id', async (req,res,next)=>{
  try{
    let employee = await employeeModel.findOne({_id:req.params.id});
    if(employee){
      let employee = await employeeModel.deleteOne({_id:req.params.id});
      res.send({
        message:'Employee deleted successfully'
      })
    }else{
      res.send({
        message:"Employee does not exixt"
      })
    }
  }catch(err){
    res.status(500).send({
      message:'Internal server error',
      err
    })
  }
})

router.put("/:id",async(req,res)=>{
  try{
    let manager = await managerModel.findOne({_id:req.params.id});
    if(manager){
      let hashedPassword = await hashPassword(req.body.password);
      manager.password=hashedPassword;
      await manager.save();
      res.send({
        manager,
        message:"manager updated successfully"
      })
    }else{
      res.send({
        message:"manager does not exists!"
      })
    }
  }
  catch(err){
    res.status(500).send({
      message:'Internal server error',
      err
    })
  }
})

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
    let user = await adminModel.findOne({email:req.body.email})
    if(user){
      if(await hashCompare(req.body.password,user.password)){
        let token = await createToken({
          name:user.name,
          email:user.email,
          id:user._id,
          role:user.role
        })
        res.status(200).send({
          message:"admin login successfully",
          token
        })
      }else{
        res.status(402).send({
          message:'Invalid Credential'
        })
      }
    }else{
      res.status(400).send({
        message:'sorry your not admin!'
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

// user can update their profile if they logged in successfully with their id

// router.put("/:id",validate,async(req,res)=>{
//   try{
//     let user = await userModel.findOne({_id:req.params.id.toString()});
//     if(user){
//       let hashedPassword = await hashPassword(req.body.password);
//       user.name=req.body.name;
//       user.password=hashedPassword;
//       await user.save();
//       res.send({
//         user,
//         message:"user updated successfully"
//       })
//     }else{
//       res.send({
//         message:"user does not exists!"
//       })
//     }
//   }
//   catch(err){
//     res.status(500).send({
//       message:'Internal server error',
//       err
//     })
//   }
// })

module.exports = router;
