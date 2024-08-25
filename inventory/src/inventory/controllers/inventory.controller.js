import { addInventoryToDb, getAllInventoriesFromDb, getInventoryBySkuFromDb } from "../services/inventory.services.js"

export const getAllInventories=async()=>{
    return await getAllInventoriesFromDb()
}

export const getInventoryBySku=async(sku)=>{
    return await getInventoryBySkuFromDb(sku)
}

export const addInventory=async(inventory)=>{
    return await addInventoryToDb(inventory)
}