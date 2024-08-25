import express from "express";
import { router as inventoryRoutes} from "./inventory/routes/inventory.route.js";
import { router as productRoutes } from "./products/routes/product.route.js";

const app = express();
app.use(express.json());
app.use(inventoryRoutes)
app.use(productRoutes)
app.listen(3002, () => {
  console.log("inventory service is listening on port 3002");
});
