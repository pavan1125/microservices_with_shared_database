import { db } from "../../../shared/src/index.js";

export const getAllOrdersFromDb = async () => {
  return await db.order.findMany({
    include: {
      products: true,
      User: {
        select: {
          name: true,
        },
      },
    },
  });
};

export const addOrderToDb = async (order) => {
  return await db.order.create({
    data: order,
  });
};

export const getOrderByIdFromDb = async (id) => {
  return await db.order.findFirst({
    where: {
      id,
    },
    include: {
      products: true,
      User: {
        select: {
          name: true,
        },
      },
    },
  });
};

export const deleteOrderFromDb = async (id) => {
  return await db.order.delete({
    where: {
      id,
    },
  });
};

export const updateOrderStatusOnDb = async (id, status) => {
  return await db.order.update({
    where: {
      id,
    },
    data: {
      status,
    },
    select: {
      products: true,
      status: true,
      id: true,
      totalAmount: true,
    },
  });
};
