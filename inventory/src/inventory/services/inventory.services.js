import { db } from "../../../../shared/src/index.js"

export const getAllInventoriesFromDb=async()=>{
    return await db.inventory.findMany({
        include:{
            product: true
        }
    })
}

export const getInventoryBySkuFromDb=async(sku)=>{
    return await db.inventory.findFirst({
        where:{
            sku
        },
        include:{
            product: true
        }
    })
}

export const addInventoryToDb=async(inventory)=>{
    return await db.inventory.create({
        data: inventory
    })
}