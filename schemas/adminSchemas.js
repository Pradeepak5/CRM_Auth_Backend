const validator = require('validator');
const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{
        type:String,
        required:true,
        lowercase:true,
        validate:(value)=>{
            return validator.isEmail(value)
        }
    },
    mobile:{type:String,default:'000-0000-000'},
    password:{type:String,required:true},
    role:{type:String,default:"admin"},
    createdAt:{type:Date,default:Date.now}
},{
    collection:'admin',
    versionKey:false
})

let adminModel = mongoose.model('admin',userSchema);
module.exports={adminModel};