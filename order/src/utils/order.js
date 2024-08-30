import { db } from "../../../shared/src/index.js";

export const checkOrderExists = async (userId) => {
  return await db.order.findFirst({
    where: {
      AND: [
        {
          status: "PENDING",
        },
        {
          userId: userId,
        },
      ],
    },
  });
};

export const updateOrderTotalAmount = async (totalAmount, orderId) => {
  console.log(totalAmount, orderId)
  return await db.order.update({
    where: {
      id: orderId,
    },
    data: {
      totalAmount,
    },
  });
};
