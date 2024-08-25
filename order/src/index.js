import express from "express";
import { router } from "./routes/order.route.js";

const app = express();
app.use(express.json());
app.use(router)

app.listen(3001, () => {
  console.log("order service is listening on port 3001");
});
