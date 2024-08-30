import express from "express";
import {
  addOrderProduct,
  deleteOrderProduct,
  getAllOrderProducts,
  getOrderProductById,
} from "../controllers/order_product.controller.js";
import { kafka } from "../../../shared/src/index.js";
import jwt from "jsonwebtoken";
export const router = express.Router();

router.get("/order_product", async (req, res) => {
  try {
    const orderProducts = await getAllOrderProducts();
    return res.status(200).send(orderProducts);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send("something went wrong while fetching orderProducts");
  }
});

router.post("/order_product", async (req, res) => {
  try {
    const orderProduct = req.body;
    // const orderProductAdded = await addOrderProduct(orderProduct);
    const response = await fetch(
      `http://localhost:3002/product/productId/${orderProduct.productId}`,
      {
        method: "GET",
      }
    );
    const product = await response.json();
    if (!product) {
      return res.status(404).send("product not found");
    }
    const inventoryResponse = await fetch(
      `http://localhost:3002/inventory/${product.sku}`,
      {
        method: "GET",
      }
    );
    const inventory = await inventoryResponse.json();
    if (!inventory) return res.status(404).send("inventory not found");
    const userName = await jwt.verify(
      req.headers.authorization.split(" ")[1],
      "secretKey"
    );
    const userResponse = await fetch(
      `http://localhost:3003/users/${userName.name}`,
      {
        method: "GET",
      }
    );
    const user = await userResponse.json();
    if (inventory.quantity < orderProduct.quantity) {
      return res
        .status(403)
        .send(
          `product quantity is less than the added quantity available ${inventory.quantity}`
        );
    }
    if (!user) {
      return res.status(404).send("please login to add order");
    }
    const producer = kafka.producer();
    await producer.connect();
    await producer.send({
      topic: "order_product_added",
      messages: [{ value: JSON.stringify({ orderProduct, userId: user.id }) }],
    });
    res
      .status(201)
      .send("order product is added and its updating in background");

    await producer.disconnect();
  } catch (error) {
    console.log(error);
    return res.status(500).send(`error while creating orderProduct`);
  }
});

router.delete("/order_product", async (req, res) => {
  try {
    const { orderId, productId } = req.query;
    const orderProduct = await getOrderProductById(orderId, productId);
    if (!orderProduct) {
      return res.status(404).send("order product not found");
    }
    const deleted = await deleteOrderProduct(orderId, productId);
    const producer = kafka.producer();
    await producer.connect();
    await producer.send({
      topic: "order_product_deleted",
      messages: [{ value: JSON.stringify(deleted) }],
    });
    res
      .status(200)
      .send("order product is deleted and its updating in background");

    await producer.disconnect();
  } catch (error) {
    console.log(error);
    return res.status(500).send(`error while creating orderProduct`);
  }
});
