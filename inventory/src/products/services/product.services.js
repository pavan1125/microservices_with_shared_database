import { db } from "../../../../shared/src/index.js"

export const getAllProductsFromDb=async()=>{
    return await db.product.findMany({
        include:{
            inventory: true,
            OrderProduct: true,
            orders:true
        }
    })
}

export const getProductBySkuFromDb=async(sku)=>{
    return await db.product.findFirst({
        where:{
            sku
        },
        include:{
            inventory: true,
            OrderProduct: true,
            orders:true
        }
    })
}

export const addProductToDb=async(product)=>{
    return await db.product.create({
        data: product
    })
}