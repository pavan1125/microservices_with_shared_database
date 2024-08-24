import express from "express";

const app = express();
app.use(express.json());

app.listen(3001, () => {
  console.log("order service is listening on port 3001");
});
