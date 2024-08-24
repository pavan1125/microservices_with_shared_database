import express from "express";

const app = express();
app.use(express.json());

app.listen(3002, () => {
  console.log("inventory service is listening on port 3002");
});
