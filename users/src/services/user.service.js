import { db } from "../../../shared/src/index.js";

export const getAllUsersFromDb = async () => {
  return await db.user.findMany({
    include:{
      orders:true
    }
  });
};

export const addUserToDb=async(user)=>{
  return await db.user.create({
    data:user
  })
}

export const getUserByName=async(name)=>{
  return await db.user.findFirst({
    where:{
      name
    }
  })
}