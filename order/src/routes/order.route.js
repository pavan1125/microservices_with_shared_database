import express from 'express';
import jwt from 'jsonwebtoken';
import { addOrder, getAllOrders } from '../controllers/order.controller.js';

export const router=express.Router();

router.get('/order',async(req,res)=>{
    try {
        const orders=await getAllOrders()
        return res.status(200).send(orders)
    } catch (error) {
        console.log(error)
        return res.status(500).send('something went wrong while fetching orders')
    }
})

router.post('/order',async(req,res)=>{
   try {
    const order = req.body
    const userName = await jwt.verify(req.headers.authorization.split(' ')[1],'secretKey')
    const response= await fetch(`http://localhost:3003/users/${userName.name}`,{
        method:'GET'
    })
    const user=await response.json()
    order.userId=user.id
    const orderAdded=await addOrder(order)
    res.status(201).send('order added successfully')
   } catch (error) {
    console.log(error)
    return res.status(500).send(`error while creating order`)
   }
})

router.get('/orders/:id',async(req,res)=>{
    try {
        const order=await getOrderById(req.params.id)
        if(!order) return res.status(404).send(`order not found`)
        return res.status(200).send(order)
    } catch (error) {
        console.log(error)
        return res.status(500).send(`error while getting order`)
    }
})