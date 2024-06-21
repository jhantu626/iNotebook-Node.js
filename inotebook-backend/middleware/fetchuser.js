const jwt=require('jsonwebtoken')
require('dotenv').config()


const fetchuser=async(req,resp,next)=>{
   try{
        const token=req.header('auth-token');
        if(!token){
            return resp.json({err: "Enter A valid Token!"}).status(401);
        }
        
        const data=jwt.verify(token,process.env.JWT_SECRET);
        console.log(data)
        req.user=data.user;
        next();
   }catch(err){
    console.log(err);
    resp.json({err: "Internal Server Error!"}).status(500);
   }
}


module.exports=fetchuser;