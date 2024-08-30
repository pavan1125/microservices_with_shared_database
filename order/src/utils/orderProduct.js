import { db } from "../../../shared/src/index.js";

export const checkOrderProductExists = async (orderId, productId) => {
  return await db.orderProduct.findFirst({
    where: {
      AND: [
        {
          orderId,
        },
        {
          productId,
        },
      ],
    },
  });
};

export const updateOrderProductQuantity = async (
  orderId,
  productId,
  quantity
) => {
  return await db.orderProduct.update({
    data: {
      quantity,
    },
    where: {
      orderId_productId: {
        orderId,
        productId,
      },
    },
  });
};
