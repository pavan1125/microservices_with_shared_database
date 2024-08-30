import express from "express";
import { router as inventoryRoutes } from "./inventory/routes/inventory.route.js";
import { router as productRoutes } from "./products/routes/product.route.js";
import { kafka } from "../../shared/src/index.js";
import {
  addInventoryToDb,
  addStockToInventory,
  deleteInventory,
} from "./inventory/services/inventory.services.js";
import {
  deleteProductBySku,
  getProductById,
  getProductBySku,
} from "./products/controllers/product.controller.js";
import { getInventoryBySku } from "./inventory/controllers/inventory.controller.js";

const app = express();
app.use(express.json());
app.use(inventoryRoutes);
app.use(productRoutes);

const consumer = kafka.consumer({ groupId: "products" });

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topics: ["product_added", "product_deleted", "order_status_updated"],
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      //add the item to the inventory with the same sku
      try {
        let messageValue = JSON.parse(message.value);
        if (topic === "product_deleted") {
          await deleteInventory(messageValue);
          await deleteProductBySku(messageValue);
          return;
        }
        if (topic === "order_status_updated") {
          console.log("asdas", messageValue);
          if (messageValue.status === "PENDING") {
            return;
          }
          if (messageValue.status === "SHIPPED") {
            const products = messageValue.products;
            products.forEach(async (product) => {
              const pro = await getProductById(product.productId);
              const inventory = await getInventoryBySku(pro.sku);
              console.log({ pro, inventory });
              const stockNeedToRemove = product.quantity;
              const updatedStock = inventory.quantity - stockNeedToRemove;
              await addStockToInventory(inventory.sku, updatedStock);
            });
          }
          if (messageValue.status === "DELIVERED") {
            return;
          }
          if (messageValue.status === "CANCELLED") {
            return;
          }
          return;
        }
        const inventoryAdded = await addInventoryToDb({
          sku: messageValue.sku,
          quantity: 0,
        });
      } catch (error) {
        console.log(error);
      }
    },
  });
};

runConsumer().catch(console.error);
app.listen(3002, () => {
  console.log("inventory service is listening on port 3002");
});
