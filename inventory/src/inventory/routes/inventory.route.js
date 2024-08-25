import express from 'express'
import { addInventory, getAllInventories, getInventoryBySku } from '../controllers/inventory.controller.js'

export const router=express.Router()

router.get("/inventory",async(req,res)=>{
    try {
        const allInventories=await getAllInventories()
        return res.status(200).send(allInventories)
    } catch (error) {
        console.log(error)
        res.status(500).send('something went wrong while fetching inventories')
    }
})

router.get('/inventory/:sku',async(req,res)=>{
    try {
        const inventory= await getInventoryBySku(req.params.sku)
        if(inventory) return res.status(200).send(inventory)
        
        return res.status(404).send(`inventory ${req.params.sku} not found`)
    } catch (error) {
       console.log(error)
       res.status(500).send(`something went wrong while fetching inventory ${req.params.sku}`) 
    }
})

router.post('/inventory', async(req,res)=>{
    try {
        const inventory= await req.body
        const inventoryAdded= await addInventory(inventory)
        return res.status(201).send("inventory added successfully")
    } catch (error) {
        console.log(error)
        return res.status(500).send(`something went wrong while adding inventory`)
    }
})