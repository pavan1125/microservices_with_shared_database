import express from "express";
import { router as orderRoutes } from "./routes/order.route.js";
import { kafka } from "../../shared/src/index.js";
import { router } from "./routes/order_product.route.js";

const app = express();
app.use(express.json());
app.use(orderRoutes)
app.use(router)
const consumer = kafka.consumer({ groupId: 'my-group' });

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'order_product_added', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
      });
    },
  });
};

runConsumer().catch(console.error);

app.listen(3001, () => {
  console.log("order service is listening on port 3001");
});
