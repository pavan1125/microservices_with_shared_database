import express from "express";
import { getAllUsers } from "../controllers/user.controller.js";

export const router = express.Router();

router.get("/users", async (req, res) => {
  try {
    const users = await getAllUsers();
    return res.status(200).send(users);
  } catch (error) {
    console.log(error)
    return res.status(500).send("something went wrong while fetching users");
  }
});

