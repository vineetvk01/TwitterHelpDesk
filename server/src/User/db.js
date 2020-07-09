import { makeDb, makeObjectId } from '../db';

export const updateOrCreate = async ( user ) => {
  delete user.id;
  const db = await makeDb();
  const query = { email : user.email };
  const config = { upsert: true, returnOriginal: false };
  const update = {
    "$set": { twitter : user.twitter, password: user.password }
  };
  
  const data = await db.collection('users').findOneAndUpdate(query, update, config);
  const userInDb = {...data.value};
  userInDb.id = data.value && data.value._id;
  delete userInDb._id; 
  return userInDb;
}

export const findUserById = async (id) => {
  const db = await makeDb();
  const query = { _id : makeObjectId(id) };
  const data = await db.collection('users').findOne(query);
  console.log(id, data);
  return data;
}

export const findUserByCredentials = async ({username, password}) => {
  const db = await makeDb();
  const query = { email: username, password};
  const data = await db.collection('users').findOne(query);
  return data;
}

export const fetchUserByTwitterId = async(twitter, adminEmail) =>{
  const db = await makeDb();
  const query = { twitter };
  const data = await db.collection('users').find(query);
  return data.toArray();
}


