import {
  addOrderToDb,
  getAllOrdersFromDb,
  getOrderByIdFromDb,
  updateOrderStatusOnDb,
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

export const updateOrderStatus = async (id, status) => {
  return await updateOrderStatusOnDb(id, status);
};
