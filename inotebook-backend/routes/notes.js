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

//Get All Notes
router.get('/',async (req,resp)=>{
    try{
        const data=await Notes.find();
        resp.json(data);
    }catch(err){
        resp.json({err: "internal Server error!"}).status(500);
    }
})

//Get notes by id
router.get('/:id',async (req,resp)=>{
    try{
        const id=req.params.id;
        const data=await Notes.findById(id);
        if(!data){
            return resp.json({messege: "User not found!"}).status(404);
        }
        resp.json(data).status(200);
    }catch(err){
        console.log(err);
        resp.json({err: "internal Server error!"}).status(500);
    }
})

//GET NOTES BY TITLE
router.get('/title/:title',async (req,resp)=>{
    try{
        const title=req.params.title
        const data=await Notes.findOne({title: title});
        if(!data){
            return resp.json({messege: "Notes Not Found"}).status(404);
        }
        resp.json(data).status(200);
    }catch(err){
        console.log(err);
        resp.json({err: "internal Server error!"}).status(500);
    }
})

router.get('/tag/:tag',async(req,resp)=>{
    try{
        const tag=req.params.tag;
        const data=await Notes.find({tag: tag});
        resp.json(data).status(200);
    }catch(err){
        console.log(err);
        resp.json({err: "Internal Server error!"}).status(500);
    }
})

router.put('/:id',async(req,resp)=>{
    try{
        const id=req.params.id;
        const data=req.body;
        const updatedData=await Notes.findByIdAndUpdate(id,data,{new: true});
        if(!updatedData){
            resp.json({messege: "Note Not Found!"}).status(404);
        }
        resp.json({messege: "Note Updated Successfully!",updatedData}).status(200);
    }catch(err){
        console.log(err);
        resp.json({err: "Internal Server Error!"}).status(500);
    }
})

router.put('/title/:title',async(req,resp)=>{
    try{
        const title=req.params.title;
        const data=req.body
        const updatedData=await Notes.findOneAndUpdate({title: title},data,
            {new : true});
        if(!updatedData){
            return resp.json({messege: "Note Not Found!"}).status(404);
        }
        
        resp.json(updatedData).status(200);
        
    }catch(err){
        console.log(err);
        resp.json({err: "Internal Server Error!"}).status(500);
    }
})

module.exports=router;
