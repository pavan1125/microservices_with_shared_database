import express from 'express'
import { addProduct, getAllProducts, getProductBySku } from '../controllers/product.controller.js'

export const router=express.Router()

router.get("/product",async(req,res)=>{
    try {
        const allProducts=await getAllProducts()
        return res.status(200).send(allProducts)
    } catch (error) {
        console.log(error)
        res.status(500).send('something went wrong while fetching Products')
    }
})

router.get('/product/:sku',async(req,res)=>{
    try {
        const product= await getProductBySku(req.params.sku)
        if(product) return res.status(200).send(product)
        
        return res.status(404).send(`product ${req.params.sku} not found`)
    } catch (error) {
       console.log(error)
       res.status(500).send(`something went wrong while fetching product ${req.params.sku}`) 
    }
})

router.post('/product', async(req,res)=>{
    try {
        const product= await req.body
        const productAdded= await addProduct(product)
        return res.status(201).send("product added successfully")
    } catch (error) {
        console.log(error)
        return res.status(500).send(`something went wrong while adding product`)
    }
})