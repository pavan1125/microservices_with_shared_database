import { db } from "../../../../shared/src/index.js";

export const getAllInventoriesFromDb = async () => {
  return await db.inventory.findMany({
    include: {
      product: true,
    },
  });
};

export const getInventoryBySkuFromDb = async (sku) => {
  return await db.inventory.findFirst({
    where: {
      sku,
    },
    include: {
      product: true,
    },
  });
};

export const addInventoryToDb = async (inventory) => {
  return await db.inventory.create({
    data: inventory,
  });
};

export const deleteInventory = async (sku) => {
  return await db.inventory.delete({
    where: {
      sku,
    },
  });
};

export const addStockToInventory = async (sku, quantity) => {
  return await db.inventory.update({
    where: {
      sku,
    },
    data: {
      quantity,
    },
  });
};
