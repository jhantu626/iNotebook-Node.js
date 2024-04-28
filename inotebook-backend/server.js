const express=require('express')
const app=express();
require('dotenv').config();
const db=require('./db')

app.get('/',(req,resp)=>{
    resp.send("Welcome to iNotebook!");
})

const logRequest=(req,resp,next)=>{
    console.log(`[${new Date().toLocaleString()}] Request on URI- (${req.originalUrl})`);
    next();
}
app.use(logRequest)
const bodyParser=require('body-parser')
app.use(bodyParser.json());

const note=require('./routes/notes')
app.use('/api/notes',note)

const auth=require('./routes/auth')
app.use('/api/auth',auth)

const user=require('./routes/users')
app.use('/api/users',user)



app.listen(process.env.PORT,()=>{
    console.log(`Application is Runing on PORT ${process.env.PORT}`);
})


