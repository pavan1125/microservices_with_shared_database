import express from "express";
import {
  addInventory,
  addStock,
  getAllInventories,
  getInventoryBySku,
} from "../controllers/inventory.controller.js";

export const router = express.Router();

router.get("/inventory", async (req, res) => {
  try {
    const allInventories = await getAllInventories();
    return res.status(200).send(allInventories);
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong while fetching inventories");
  }
});

router.get("/inventory/:sku", async (req, res) => {
  try {
    const inventory = await getInventoryBySku(req.params.sku);
    if (inventory) return res.status(200).send(inventory);

    return res.status(404).send(`inventory ${req.params.sku} not found`);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send(`something went wrong while fetching inventory ${req.params.sku}`);
  }
});

router.post("/inventory", async (req, res) => {
  try {
    const inventory = await req.body;
    const inventoryAdded = await addInventory(inventory);
    return res.status(201).send("inventory added successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).send(`something went wrong while adding inventory`);
  }
});

router.post("/inventory/:sku/stock", async (req, res) => {
  try {
    const quantity = await req.body.quantity;
    if (!quantity && typeof quantity !== "number") {
      return res.status(403).send("invalid quantity provided");
    }
    await addStock(req.params.sku, quantity);
    return res.status(200).send("quantity updated successfully");
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send("something went wrong while adding quantity to inventory");
  }
});
