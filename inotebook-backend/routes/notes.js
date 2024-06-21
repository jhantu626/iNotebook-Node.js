const express=require('express')
const router=express.Router();
const Notes=require('./../models/Notes')
const fetchUser=require('./../middleware/fetchuser')
const {body,validationResult}=require('express-validator')


//Create Notes
router.post('/',fetchUser,[
    body('title','Enter A valid title').isLength({min: 5}),
    body('description','Description must be 5 character').isLength({min: 5})
],async (req,resp)=>{
    try{
        const error=validationResult(req);
        if(!error.isEmpty){
            return resp.json({error: error}).status(400);
        }
        const data=req.body
        const noteData=new Notes(data);
        noteData.user=req.user.id;
        const savedData=await noteData.save();
        resp.json({messege: "Notes Created",savedData}).status(200) 
    }catch(err){
        console.log(err);
        resp.json({err: "Internal Server Error!"}).status(500)
    }
})

//2. Get All Notes
router.get('/',fetchUser,async (req,resp)=>{
    try{
        const id=req.user.id;
        const data=await Notes.find({user: id});
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
router.get('/title/:title',fetchUser,async (req,resp)=>{
    try{
        const title=req.params.title
        const data=await Notes.findOne({title: title,user: req.user.id});
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


router.get('/')


//Update Notes
router.put("/updatenotes/:id",fetchUser,async (req,resp)=>{
    try{
        const {title,description,tag}=req.body;
        const noteId=req.params.id;
        const notes=await Notes.findById(noteId);
        if(!notes){
            return resp.json("Invalid note id!").status(200);
        }
        const userId=req.user.id;
        if(userId!==notes.user.toString()){
            return resp.json("Unauthorized").status(401);
        }
        if(title){notes.title=title}
        if(description){notes.description=description}
        if(tag){notes.tag=tag}
        await notes.save();
        resp.json({msg: "Note Updated",notes})
    }catch(err){
        resp.json(err);
    }
})

router.delete("/delete/:id",fetchUser,async (req,resp)=>{
    try{
        const noteId=req.params.id;
        const notes=await Notes.findById(noteId);
        if(!notes){
            return resp.json("Invalid note id!").status(200);
        }
        const userId=req.user.id;
        if(userId!==notes.user.toString()){
            return resp.json("Unauthorized").status(401);
        }
        await Notes.findByIdAndDelete(notes.id);
        resp.json({msg: "Note Deleted"})
    }catch(err){
        resp.json(err);
    }
})




module.exports=router;