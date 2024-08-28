import {
  addOrderProductToDb,
  getAllOrderProductsFromDb,
} from "../services/order_product.services.js";

export const getAllOrderProducts = async () => {
  return await getAllOrderProductsFromDb();
};

export const addOrderProduct = async (orderProduct) => {
  return await addOrderProductToDb(orderProduct);
};
