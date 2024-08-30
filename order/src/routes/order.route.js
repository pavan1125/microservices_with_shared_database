import express from "express";
import jwt from "jsonwebtoken";
import {
  addOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { kafka } from "../../../shared/src/index.js";

export const router = express.Router();

router.get("/order", async (req, res) => {
  try {
    const orders = await getAllOrders();
    return res.status(200).send(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).send("something went wrong while fetching orders");
  }
});

router.post("/order", async (req, res) => {
  try {
    const order = req.body;
    const userName = await jwt.verify(
      req.headers.authorization.split(" ")[1],
      "secretKey"
    );
    const response = await fetch(
      `http://localhost:3003/users/${userName.name}`,
      {
        method: "GET",
      }
    );
    const user = await response.json();
    order.userId = user.id;
    const orderAdded = await addOrder(order);
    res.status(201).send("order added successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).send(`error while creating order`);
  }
});

router.get("/orders/:id", async (req, res) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) return res.status(404).send(`order not found`);
    return res.status(200).send(order);
  } catch (error) {
    console.log(error);
    return res.status(500).send(`error while getting order`);
  }
});

router.post("/orders/:id/status", async (req, res) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) return res.status(404).send(`order not found`);
    if (
      !["PENDING", "SHIPPED", "DELIVERED"].includes(
        req.body.status.toUpperCase()
      )
    ) {
      return res.status(403).send("incorrect order status provided");
    }
    const producer = kafka.producer();
    await producer.connect();
    const UpdatedOrder = await updateOrderStatus(
      req.params.id,
      req.body.status ?? "PENDING"
    );
    await producer.send({
      topic: "order_status_updated",
      messages: [{ value: JSON.stringify(UpdatedOrder) }],
    });
    producer.disconnect();
    return res
      .status(200)
      .send("order status is updated and background process is started");
  } catch (error) {
    console.log(error);
    return res.status(500).send(`error while updating order status`);
  }
});

router.delete("/orders/:id", async (req, res) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) return res.status(404).send(`order not found`);
    const producer = kafka.producer();
    await producer.connect();
    await producer.send({
      topic: "order_deleted",
      messages: [{ value: JSON.stringify(order) }],
    });
    producer.disconnect();
    return res
      .status(200)
      .send(
        "order deleted deletion of order products in running in background"
      );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send("something went wrong while deleting the order");
  }
});
