const express=require('express')
const router=express.Router();

const User=require('./../models/User')

//getUsers
router.get('/',async (req,resp)=>{
    try{
        const data=await User.find();
        resp.json(data).status(200);
    }catch(err){
        console.log(err);
        resp.json({err: "Internal Server Error"}).status(500);
    }
})

router.get('/:id',async (req,resp)=>{
    try{
        const id=req.params.id;
        const data=await User.findById(id);
        if(!data){
            return resp.json({messege: "User Not Found"}).status(404);
        }
        resp.json(data).status(200);
    }catch(err){
        console.log(err);
        resp.json({err: "Internal Server Error!"}).status(500);
    }
})

//get User by email
router.get('/email/:email',async (req,resp)=>{
    try{
        const email=req.params.email;
        const data=await User.findOne({email: email});
        if(!data){
            return resp.json({messege: "User Not Found!"}).status(404);
        }
        resp.json(data).status(200);
    }catch(err){
        resp.json({err: "Internal Server Error!"}).status(500);
    }
})

//update User Details
router.put('/:id',async (req,resp)=>{
    try{
        const id=req.params.id;
        const data=req.body;
        const updatedData=await User.findByIdAndUpdate(id,data,{
            new: true
        })
        if(!updatedData){
            return resp.json({messege: "User Not Found"}).status(404);
        }
        resp.json({messege: "User Updated Successfully!",updatedData}).status(200);
    }catch(err){
        console.log(err);
        resp.json({err: "Internal Server Error"}).status(500);
    }
})

//Update Using Email
router.put('/email/:email',async(req,resp)=>{
    try{
        const email=req.params.email;
        const data=req.body;
        const updatedData=await User.findOneAndUpdate({email:email},data,{
            new: true
        })
        if(!updatedData){
            return resp.json({messege: "User Not Found!"}).status(404);
        }
        resp.json({messege: "User Updated Successfully!",updatedData}).status(200);
    }catch(err){
        console.log(err);
        resp.json({err: "Internal Server Error!"}).status(500);
    }
})

router.delete('/:id',async(req,resp)=>{
    try{
        const id=req.params.id
        const deletedData=await User.findByIdAndDelete(id);
        if(!deletedData){
            return resp.json({messege: "User Not Found"}).status(404);
        }
        resp.json({messege: "User Deleted Successfully"});
    }catch(err){
        console.log(err);
        resp.json({err: "Internal Server Error!"}).status(500);
    }
})


router.delete('/email/:email',async (req,resp)=>{
    try{
        const email=req.params.email
        const deletedData=await User.findOneAndDelete({email: email});
        if(!deletedData){
            return resp.json({messege: "User Not Found"}).status(404);
        }
        resp.json({messege: "User Deleted Successfylly!"}).status(200);
    }catch(err){
        console.log(err);
        resp.json({err: "Internal Server Error!"}).status(500);
    }
})

module.exports=router