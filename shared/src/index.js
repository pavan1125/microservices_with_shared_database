import { PrismaClient } from "@prisma/client";
import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});

export const db = new PrismaClient();
