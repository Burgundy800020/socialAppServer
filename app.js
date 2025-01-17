const express = require('express')
const bcrypt = require('bcrypt')
var cors = require('cors')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
var routes = require('./routes/routes')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3080
const jwtSecretKey = process.env.JWT_KEY
const dbUrl = process.env.MONGODB_URL || ""

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// Connect to MongoDB using Mongoose
mongoose.connect(dbUrl)
.then((mongo)=>{
    console.log("connection done")
})

const db = mongoose.connection;

db.on('error', (error)=>{
    console.log(error)
})

db.once('connected', ()=>{
    console.log("database connected")
})

const router = routes.router
const userModel = routes.userModel
const postModel = routes.postModel
app.use("/api", router)



router.post('/auth', async (req, res)=>{
    const {email, password} = req.body
    try{
        const user = await userModel.findOne({"email" : email}, "email password")
        if(user !== null){
            if(user.password === password){
                let loginData = {
                    email,
                    signinTime : Date.now()
                }
                const token = jwt.sign(loginData, jwtSecretKey)
                return res.status(200).json({message:"success", email: email,token: token});
            }
            else
                return res.status(401).json({message : "Invalid password"});
        }else{
            return res.status(401).json({message : "User not found"});
        }
    }
    catch(error){
        res.status(400).json({message: error.message})
    }
});

router.post('/verify', (req, res)=>{
    const tokenHeaderKey = 'jwt-token';
    const authToken = req.headers[tokenHeaderKey];
    try{
        const verified = jwt.verify(authToken, jwtSecretKey);
        if(verified){
            return res.status(200).json({status : "logged in", message : 'success'});
        }else{
            //Access Denied
            return res.status(401).json({status: 'invalid auth', message: 'error'});
        }
    }catch(error){
        // Access Denied
        console.log(error);
        return res.status(401).json({status: 'invalid auth', message: 'error'});
    }
});

app.get('/', (req, res)=>{
    res.send("Auth API.\n Please use POST /auth & POST /verify for authentication");
});

app.post('/auth', (req, res)=>{
    const {email, password} = req.body;
    const user = db.data.users.filter((user)=>email === user.email);
    if(user.length === 1){
        if(user[0].password === password){
            let loginData = {
                email,
                signinTime : Date.now()
            }
            const token = jwt.sign(loginData, jwtSecretKey);
            return res.status(200).json({message:"success", token: token});
        }
        else
            return res.status(401).json({message : "Invalid password"});
    }else{
        return res.status(401).json({message : "User not found"});
    }
})

app.post('/signup', (req, res)=>{
    const {email, password} = req.body;
    const user = db.data.users.filter((user)=>user.email === email);
    if(user.length >= 1){
        return res.status(401).json({message : "taken"});
    }
    db.data.users.push({email:email, password:password});
    db.write();
    let signupData = {
        email, 
        signupTime: Date.now()
    };
    const token = jwt.sign(signupData, jwtSecretKey);
    return res.status(200).json({message:"success", token});
});

app.post('/verify', (req, res)=>{
    const tokenHeaderKey = 'jwt-token';
    const authToken = req.headers[tokenHeaderKey];
    try{
        const verified = jwt.verify(authToken, jwtSecretKey);
        if(verified){
            return res.status(200).json({status : "logged in", message : 'success' });
        }else{
            //Access Denied
            return res.status(401).json({status: 'invalid auth', message: 'error'});
        }
    }catch(error){
        // Access Denied
        console.log(error);
        return res.status(401).json({status: 'invalid auth', message: 'error'});
    }
});

app.listen(PORT);
console.log("app running at " + PORT);