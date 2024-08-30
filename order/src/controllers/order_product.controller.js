import {
  addOrderProductToDb,
  deleteOrderProductFromDb,
  getAllOrderProductsFromDb,
  getOrderProductFromDb,
} from "../services/order_product.services.js";

export const getAllOrderProducts = async () => {
  return await getAllOrderProductsFromDb();
};

export const addOrderProduct = async (orderProduct) => {
  return await addOrderProductToDb(orderProduct);
};

export const deleteOrderProduct = async (orderId, productId) => {
  return await deleteOrderProductFromDb(orderId, productId);
};

export const getOrderProductById = async (orderId, productId) => {
  return await getOrderProductFromDb(orderId, productId);
};
