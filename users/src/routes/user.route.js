import express from "express";
import { addUser, getAllUsers, getUserByNameFromDb } from "../controllers/user.controller.js";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
export const router = express.Router();

router.get("/users", async (req, res) => {
  try {
    const users = await getAllUsers();
    return res.status(200).send(users);
  } catch (error) {
    console.log(error)
    return res.status(500).send("something went wrong while fetching users");
  }
});

router.post('/users',async(req,res)=>{
  try {
     const user=req.body
     const userAlreadyExists= await getUserByNameFromDb(user.name)
     if(userAlreadyExists){
      return res.status(400).send("name already exists")
     }
     const hashedPassword=await bcrypt.hash(user.password,10)
     user.password=hashedPassword
     const userCreated= await addUser(user)
     return res.status(201).send("user created successfully")
  } catch (error) {
    console.log(error)
    return res.status(500).send("error creating user")
  }
})

router.post('/users/login',async(req,res)=>{
    try {
      const user= await getUserByNameFromDb(req.body.name)
      if(!user){
        return res.status(404).send('user not found')
      }
      const password=user.password
     const isPasswordValid =await bcrypt.compare(req.body.password, password)
      if(!isPasswordValid){
        return res.status(400).send('password not valid')
      }
      const token =await jwt.sign({
        name:user.name
      },'secretKey',{
        expiresIn:'365d'
      })
      res.status(200).send({token})
    } catch (error) {
     console.log(error)
     res.status(500).send('something went wrong while signing') 
    }
})

router.get('/users/:name',async(req,res)=>{
  try {
    const name=req.params.name
    const user= await getUserByNameFromDb(name)
    if(!name){
      return res.status(404).send('user not found')
    }
    return res.status(200).send(user)
  } catch (error) {
    console.log(error)
    return res.status(500).send('something went wrong while getting user')
  }
})