import { addUserToDb, getAllUsersFromDb, getUserByName } from "../services/user.service.js";

export const getAllUsers = async () => {
  return await getAllUsersFromDb();
};

export const addUser= async(user)=>{
  return await addUserToDb(user)
}

export const getUserByNameFromDb = async(name)=>{
  return await getUserByName(name)
}