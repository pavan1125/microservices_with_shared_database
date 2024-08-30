import { db } from "../../../shared/src/index.js";

export const getAllOrderProductsFromDb = async () => {
  return await db.orderProduct.findMany({
    include: {
      order: true,
      product: true,
    },
  });
};

export const addOrderProductToDb = async (orderProduct) => {
  return await db.orderProduct.create({
    data: orderProduct,
  });
};

export const deleteOrderProductFromDb = async (orderId, productId) => {
  return await db.orderProduct.delete({
    where: {
      orderId_productId: {
        orderId,
        productId,
      },
    },
  });
};

export const getOrderProductFromDb = async (orderId, productId) => {
  return await db.orderProduct.findUnique({
    where: {
      orderId_productId: {
        orderId,
        productId,
      },
    },
  });
};
