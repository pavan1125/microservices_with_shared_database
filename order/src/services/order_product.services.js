import { db } from "../../../shared/src/index.js";

export const getAllOrderProductsFromDb = async () => {
  return await db.orderProduct.findMany();
};

export const addOrderProductToDb = async (orderProduct) => {
  return await db.orderProduct.create({
    data: orderProduct,
  });
};
