import { getAllUsersFromDb } from "../services/user.service.js";

export const getAllUsers = async () => {
  return await getAllUsersFromDb();
};
