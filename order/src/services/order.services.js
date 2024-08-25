import { db } from "../../../shared/src/index.js"

export const getAllOrdersFromDb=async()=>{
    return await db.order.findMany()
}

export const addOrderToDb=async(order)=>{
    return await db.order.create(order)
}

export const getOrderByIdFromDb=async(id)=>{
    return await db.order.findFirst({
        where:{
            id
        }
    })
}