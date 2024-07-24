const express = require("express")
const router = express.Router()
const userModel = require("../model/userModel")
const postModel = require("../model/postModel")

router.post('/signup', async (req, res) => {
    const {email, password} = req.body
    try {
        const userExisting = await userModel.findOne({"email": email}, "email")
        if(userExisting !== null){
            return res.status(400).json({message:"taken"})
        }
        const data = new userModel({
            email: email,
            password: password,
            follows:[],
            followers: [],
            followReqs:[]
        })
        const dataToSave = await data.save()
        res.status(200).json({data: dataToSave, message:"success"})
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

router.post('/post', async(req, res)=>{
    //console.log("receiving post request " + req.body.content)
    const {email, content} = req.body
    try{
        const user = await userModel.findOne({"email":email}, "email")
        if(user === null){
            return res.status(400).json({message:"user does not exist"})
        }
        const data = new postModel({
            time: Date.now(),
            date: new Date(),
            author: user.email,
            authorId: user._id,
            content: content
        })
        const dataToSave = await data.save()
        return res.status(200).json({data: dataToSave, message:"success"})
    }
    catch(error){
        res.status(400).json({message: error.message})
    }
})

router.post("/feed", async(req, res)=>{
    //console.log("receiving feed request")
    const user = req.body.user 
    const page = parseInt(req.body.page) || -1
    const limit = 8
    try{
        const followedUsers = await userModel.findOne({ email: user }, 'follows')
        if(!followedUsers)return res.status(400).json({message:"invalid user name"})
        const posts = await postModel.find({ authorId: { $in: followedUsers.follows } }).sort({ time: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

        res.status(200).json({data :posts, message:"success"});
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.post("/follow", async(req, res)=>{
    const source = req.body.source
    const target = req.body.target
    const action = req.body.action 
    try{
        if(action === "follow"){
            const updatedUser = await userModel.findOneAndUpdate({email:target}, {$push:{
                followReqs: source
            }}, 
            {
                new: true
            });
        }
        else if(action === "unfollow"){
            const unfollowedUser = await userModel.findOne({email:target}, "_id")
            const updatedUser = await userModel.findOneAndUpdate({email:source}, {$pull:{
                follows: unfollowedUser._id
            }}, 
            {
                new: true
            });
        }
        
        res.status(200).json({message:"success"});
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.post("/explore", async(req, res)=>{
    //console.log("receiving explore req")
    const user = req.body.user
    //console.log(user)
    try{
        const users = await userModel.find({email:{$ne: user} }, {email:1, _id:1})
        const followedUsers = await userModel.findOne({ email: user }, 'follows')
        if(!followedUsers)return res.status(400).json({message:"invalid user name"})
        const requestedUsers = await userModel.find({ followReqs: user }, '_id')
        const requestedUsersId = requestedUsers.map(x=>x.toObject()._id)
        for(i in users){
            x = users[i].toObject()
            x.followed = followedUsers.follows.some(id=>id.equals(x._id))
            x.requested = requestedUsersId.some(id=>id.equals(x._id))
            users[i] = x
        }
        res.status(200).json({data:users, message:"success"})
    }catch(err){
        console.error(err)
        res.status(500).json({message:err.message})
    }
})

router.post("/requests", async(req, res)=>{
    const user = req.body.user
    try{
        const users = await userModel.findOne({email:user}, "followReqs")
        res.status(200).json({data:users.followReqs, message:"success"})
    }catch(err){
        console.error(err)
        res.status(500).json({message:err.message})
    }
})

router.post("/confirm", async(req, res)=>{
    const source = req.body.source
    const target = req.body.target 
    const action = req.body.action
    try{
        let updatedUser = await userModel.findOneAndUpdate({email:source}, {$pull:{
            followReqs: target
        }}, 
        {
            new: true
        });
        const followerId = updatedUser.toObject()._id
        if(action === "confirm"){
            updatedUser = await userModel.findOneAndUpdate({email:target}, {$push:{
                follows: followerId
            }}, 
            {
                new: true
            });
        }
        res.status(200).json({message:"success"});
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.post("/myposts", async(req, res)=>{
    //console.log("receiving feed request")
    const user = req.body.user; 
    try{
        const posts = await postModel.find({author:user})
            .sort({time : -1 }) // Sort by newest first

        res.status(200).json({data :posts, message:"success"});
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})


module.exports = {router, userModel, postModel}