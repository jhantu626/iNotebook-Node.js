const express=require('express')
const router=express.Router();

const User=require('./../models/User')


//Create User
router.post('/',async (req,resp)=>{
    try{
        const user=new User(req.body);
        const savedUser=await user.save();
        console.log(savedUser);
        resp.json({messege: "User Created",savedUser}).status(200);
    }catch(err){
        resp.json({err: err}).status(500);
    }
})



module.exports=router