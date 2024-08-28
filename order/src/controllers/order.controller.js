import {
  addOrderToDb,
  getAllOrdersFromDb,
} from "../services/order.services.js";

export const getAllOrders = async () => {
  return await getAllOrdersFromDb();
};
export const addOrder = async (order) => {
  return await addOrderToDb(order);
};
export const getOrderById = async (id) => {
  return await getOrderByIdFromDb(id);
};
