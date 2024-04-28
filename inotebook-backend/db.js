const mongoose=require('mongoose')
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI);

const db=mongoose.connection;

db.on('connected',()=>{
    console.log("Mongodb Connection Established!");
})
db.on('disconnected',()=>{
    console.log("Mongo Db Connection Disconnected");
})
db.on('error',(err)=>{
    console.log(err);
})

module.exports=db