import express from "express";
import { router as orderRoutes } from "./routes/order.route.js";
import { kafka } from "../../shared/src/index.js";
import { router } from "./routes/order_product.route.js";
import { checkOrderExists, updateOrderTotalAmount } from "./utils/order.js";
import { addOrderToDb, deleteOrderFromDb } from "./services/order.services.js";
import { generateRandomString } from "./utils/common.js";
import { addOrderProductToDb } from "./services/order_product.services.js";
import {
  checkOrderProductExists,
  updateOrderProductQuantity,
} from "./utils/orderProduct.js";
import { deleteOrderProduct } from "./controllers/order_product.controller.js";

const app = express();
app.use(express.json());
app.use(orderRoutes);
app.use(router);
const consumer = kafka.consumer({ groupId: "my-group" });
// const producer = kafka.producer();
// await producer.connect();
const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topics: ["order_product_added", "order_product_deleted", "order_deleted"],
    fromBeginning: true,
  });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const messageValue = JSON.parse(message.value);
        console.log("🚀 ~ eachMessage: ~ messageValue:", messageValue);

        if (topic === "order_deleted") {
          const orderProducts = messageValue.products;
          if (
            messageValue.status === "PENDING" &&
            Array.isArray(orderProducts)
          ) {
            orderProducts.forEach(async (order) => {
              await deleteOrderProduct(order.orderId, order.productId);
            });
          } else if (
            messageValue.status === "SHIPPED" &&
            Array.isArray(orderProducts)
          ) {
            //add the quantity back to the stock in inventory
            orderProducts.forEach(async (order) => {
              const response = await fetch(
                `http://localhost:3002/product/productId/${order.productId}`,
                {
                  method: "GET",
                }
              );
              const product = await response.json();
              await fetch(
                `http://localhost:3002/inventory/${product.sku}/stock`,
                {
                  method: "POST",
                  body: JSON.stringify({ quantity: order.quantity }),
                }
              );
              await deleteOrderProduct(order.orderId, order.productId);
            });
          }
          await deleteOrderFromDb(messageValue.id);
          return;
        }

        // check weather the inventory has stock or not using the kafka event and consume it before order product is added to db and manage the order product , adjust the total price of the order
        const orderExists = await checkOrderExists(messageValue.userId);
        const orderProductExists = await checkOrderProductExists(
          messageValue.orderProduct.orderId,
          messageValue.orderProduct.productId
        );
        const response = await fetch(
          `http://localhost:3002/product/productId/${messageValue.orderProduct.productId}`,
          {
            method: "GET",
          }
        );
        const product = await response.json();
        if (topic === "order_product_deleted") {
          // if orderProduct is deleted update the order
          const deletedQuantity = messageValue.quantity;
          const deletedProductPrice = product.price;
          const totalPrice = orderExists.totalAmount;
          const updatedPrice =
            totalPrice - deletedQuantity * deletedProductPrice;
          await updateOrderTotalAmount(updatedPrice, messageValue.orderId);
          return;
        }
        if (orderProductExists) {
          // add the quantity to the order product and update the latest total amount to the order
          const quantity = messageValue.orderProduct.quantity;
          const updatedOrderProduct = await updateOrderProductQuantity(
            messageValue.orderProduct.orderId,
            messageValue.orderProduct.productId,
            quantity + orderProductExists.quantity
          );
          const current_amount = orderExists.totalAmount;
          const updated_amount =
            current_amount + Number(product.price) * Number(quantity);
          await updateOrderTotalAmount(
            updated_amount,
            messageValue.orderProduct.orderId
          );
          return;
        }
        if (!orderExists) {
          const orderProduct = messageValue.orderProduct;
          const order = {
            orderNumber: generateRandomString(6),
            totalAmount: 0,
            status: "PENDING",
            userId: messageValue.userId,
          };
          const orderAdded = await addOrderToDb(order);
          orderProduct.orderId = orderAdded.id;
          const currentTotalAmount = 0;
          const product_added_total_price =
            Number(currentTotalAmount) +
            Number(orderProduct.quantity) * Number(product.price);
          await addOrderProductToDb(orderProduct);
          await updateOrderTotalAmount(
            product_added_total_price,
            orderAdded.id
          );
          // await producer.send({
          //   topic: "order_product_updated",
          //   value: [
          //     {
          //       value: JSON.stringify({
          //         status: 201,
          //         message: "orderProduct added successFully",
          //       }),
          //     },
          //   ],
          // });
          // producer.disconnect();
        } else {
          const currentTotalAmount = orderExists.totalAmount;
          if (!product) {
            return app.response.status(404).send("product added is not found ");
          }
          const product_added_total_price =
            Number(currentTotalAmount) +
            Number(messageValue.orderProduct.quantity) * Number(product.price);
          await addOrderProductToDb(messageValue);
          await updateOrderTotalAmount(
            product_added_total_price,
            messageValue.orderProduct.orderId
          );
          // await producer.send({
          //   topic: "order_product_updated",
          //   messages: [
          //     {
          //       value: JSON.stringify({
          //         status: 201,
          //         message: "orderProduct added successFully",
          //       }),
          //     },
          //   ],
          // });
          // producer.disconnect();
        }
      } catch (error) {
        console.log(error);
        await handleProducerError(error);
      }
    },
  });
};
const handleProducerError = async (errorMessage) => {
  try {
    // await producer.connect();
    // await producer.send({
    //   topic: "order_product_updated",
    //   messages: [
    //     {
    //       value: JSON.stringify({
    //         status: 500,
    //         message: errorMessage,
    //       }),
    //     },
    //   ],
    // });
  } catch (producerError) {
    console.error("Error sending error message:", producerError);
  } finally {
    // await producer.disconnect();
  }
};
runConsumer().catch(console.error);

app.listen(3001, () => {
  console.log("order service is listening on port 3001");
});
