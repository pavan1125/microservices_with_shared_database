import { addProductToDb, getAllProductsFromDb, getProductBySkuFromDb } from "../services/product.services.js"

export const getAllProducts=async()=>{
    return await getAllProductsFromDb()
}

export const getProductBySku=async(sku)=>{
    return await getProductBySkuFromDb(sku)
}

export const addProduct=async(inventory)=>{
    return await addProductToDb(inventory)
}