const express=require('express')
const router=express.Router();

const Notes=require('./../models/Notes')


//Create Notes
router.post('/',async (req,resp)=>{
    try{
        const data=req.body
        const noteData=new Notes(data);
        const savedData=await noteData.save();
        resp.json({messege: "Notes Created",savedData}).status(200) 
    }catch(err){
        console.log(err);
        resp.json({err: "Internal Server Error!"}).status(500)
    }
})


module.exports=router;
