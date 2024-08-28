import express from "express";
import {
  addOrderProduct,
  getAllOrderProducts,
} from "../controllers/order_product.controller.js";
import { kafka } from "../../../shared/src/index.js";

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
    const orderProductAdded = await addOrderProduct(orderProduct);
    const producer = kafka.producer();

    await producer.connect();
    await producer.send({
      topic: "order_product_added",
      messages: [{ value: JSON.stringify(orderProductAdded) }],
    });

    await producer.disconnect();
    res.status(201).send("orderProduct added successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).send(`error while creating orderProduct`);
  }
});
