import express from "express";
import {router} from "./routes/user.route.js";

const app = express();
app.use(express.json());

app.use(router);
app.listen(3003, () => {
  console.log("user service is listening on port 3003");
});
