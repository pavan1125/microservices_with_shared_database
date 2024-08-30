import express from "express";
import {
  addProduct,
  deleteProductBySku,
  getAllProducts,
  getProductById,
  getProductBySku,
} from "../controllers/product.controller.js";
import { kafka } from "../../../../shared/src/index.js";

export const router = express.Router();

router.get("/product", async (req, res) => {
  try {
    const allProducts = await getAllProducts();
    return res.status(200).send(allProducts);
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong while fetching Products");
  }
});

router.get("/product/:sku", async (req, res) => {
  try {
    const product = await getProductBySku(req.params.sku);
    if (product) return res.status(200).send(product);

    return res.status(404).send(`product ${req.params.sku} not found`);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send(`something went wrong while fetching product ${req.params.sku}`);
  }
});

router.post("/product", async (req, res) => {
  try {
    const product = await req.body;
    const productProducer = kafka.producer();
    // const consumer = kafka.consumer({ groupId: "inventory" });
    // await consumer.subscribe({ topic: "inventory_added", fromBeginning: true });
    await productProducer.connect();
    const productAdded = await addProduct(product);
    await productProducer.send({
      topic: "product_added",
      messages: [{ value: JSON.stringify(productAdded) }],
    });

    // await consumer.run({
    //   eachMessage: async ({ topic, partition, message }) => {
    //     const messageValue = JSON.parse(message.value);
    //     if (messageValue.sku === product.sku) {
    //     }
    //   },
    // });

    await productProducer.disconnect();
    return res
      .status(201)
      .send("product added successfully and updating in background");
  } catch (error) {
    console.log(error);
    return res.status(500).send(`something went wrong while adding product`);
  }
});

router.get("/product/productId/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await getProductById(id);
    if (!product) {
      return res.status(404).send("product not found");
    }
    res.status(200).send(product);
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong while fetching product");
  }
});

router.delete("/product/:sku", async (req, res) => {
  try {
    const sku = req.params.sku;
    const productExist = await getProductBySku(sku);
    if (!productExist) {
      return res.status(404).send("product not found");
    }
    // const deleted = await deleteProductBySku(sku);
    const productProducer = kafka.producer();
    await productProducer.connect();
    await productProducer.send({
      topic: "product_deleted",
      messages: [{ value: JSON.stringify(sku) }],
    });
    return res.status(200).send("product deleted successfully and processing in background")
  } catch (error) {
    console.log(error)
    return res.status(500).send('something went wrong while deleting product')
  }
});
