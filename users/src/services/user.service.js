import { db } from "../../../shared/src/index.js";

export const getAllUsersFromDb = async () => {
  return await db.user.findMany();
};
