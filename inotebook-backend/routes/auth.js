const express=require('express')
const router=express.Router();
const bcrypt=require('bcrypt')
require('dotenv').config();

const {body,validationResult} = require('express-validator')
const jwt=require('jsonwebtoken')
const fetchUser=require('./../middleware/fetchuser')

const User=require('./../models/User')


//Create User
router.post('/',[
    body('email').isEmail(),
    body('name','Name Should Be minimum 5').isLength({min : 5}),
    body('password','Password must be atleast 5 character!')
    .isLength({min: 8,max: 15})
],async (req,resp)=>{
    try{
        //If there are any errors occur for validations
        const err=validationResult(req);
        if(!err.isEmpty()){
            resp.json(err).status(400);
        }

        //Check If User is Exist or Not
        const email=req.body.email;
        const validUser=await User.findOne({email: email});
        if(validUser){
            return resp.json({err: "Sorry, User already exist!"}).status(400);
        }

        const salt=await bcrypt.genSalt(10);
        const secPass=await bcrypt.hash(req.body.password,salt);

        //Create new user
        const user=new User(req.body);
        user.password=secPass;
        const savedUser=await user.save();
        
        const data={
            user: {
                id: savedUser.id
            }
        }
        
        const jwtToken=jwt.sign(data,process.env.JWT_SECRET);
        console.log(jwtToken);

        resp.json(jwtToken).status(200);
    }catch(err){
        console.log(err);
        resp.json({err: err}).status(500);
    }
})

//Authenticate User
router.get('/login',[
    body('email').isEmail(),
    body('password','Password must be atleast 5 character!')
    .isLength({min: 8,max: 15})
],async(req,resp)=>{
    try{
        const error=validationResult(req);
        //If there are any errors occur for validations
        const err=validationResult(req);
        if(!err.isEmpty()){
            resp.json(err).status(400);
        }0

        const userData=req.body;
        const user=await User.findOne({email: userData.email});
        if(!user){
            return resp.json({messege: "Enter valid Credentials!"}).status(404);
        }

        const isValidPassword=await bcrypt.compare(userData.password,user.password);
        if(!isValidPassword){
            return resp.json({messege: "Enter valid Credentials!"}).status(404);
        }
        const payload={
            user: {
                id: user._id
            }
        }
        const token=jwt.sign(payload,process.env.JWT_SECRET)
        resp.json({authToken: token}).status(200);

    }catch(err){
        console.log(err);
        resp.json({err: "Internal Server error!"}).status(500);
    }
})


router.post('/getuser',fetchUser,async(req,resp)=>{
    try{
        const userId=req.user.id;
        const user=await User.findById(userId).select("-password");
        resp.json(user).status(200);
    }catch(err){
        console.log(err);
        resp.json({err: "internal Server error!"}).status(500);
    }
})


module.exports=router