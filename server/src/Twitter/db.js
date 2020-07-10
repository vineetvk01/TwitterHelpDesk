import { makeDb, makeObjectId } from '../db';

export const saveNewOauthToken = async ({ oauth_token, oauth_token_secret, oauth_callback_confirmed }) => {
  const db = await makeDb();
  const done = await db.collection('twitter').insertOne({ oauth_token, oauth_token_secret, oauth_callback_confirmed });
  return done.insertedId;
}

export const twitterUserExists = async (query) => {
  const db = await makeDb();
  const exists = await db.collection('twitter').findOne(query);
  return exists ? true : false;
}

export const updateOauthToken = async (
  query,
  { oauth_token,
    user_oauth_token,
    user_oauth_token_secret,
    screen_name,
    user_id,
    twitter_id,
    name,
    location,
    description,
    profile_image_url,
    email,
  }) => {
  const db = await makeDb();
  const update = {
    "$set": {
      user_oauth_token,
      user_oauth_token_secret,
      screen_name,
      user_id,
      twitter_id,
      name,
      location,
      description,
      profile_image_url,
      email,
    }
  }
  const options = { returnNewDocument: true };
  const data = await db.collection('twitter').findOneAndUpdate(query, update, options);
  return data.value._id;
}

export const deleteOauthToken = async (query) => {
  const db = await makeDb();
  return db.collection('twitter').deleteOne(query);
}

export const fetchTwitterOauthById = async (id) => {
  id = typeof id === 'string' ? makeObjectId(id) : id;
  const db = await makeDb();
  const query = { _id: id };
  const data = await db.collection('twitter').findOne(query);
  return data;
}

export const createTweet = async (user_id, tweet) => {
  const query = {user_id, 'tweet.id': tweet.id};
  const update = {
    "$set": {
      user_id,
      tweet
    }
  }
  const options = { upsert: true, returnNewDocument: true };
  const db = await makeDb();
  await db.collection('timeline').findOneAndUpdate(query, update, options);
};

export const fetchTweets = async (user_id) => {
  const db = await makeDb();
  const result = await db.collection('timeline').find({user_id});
  return (await result.toArray()).reverse();
};
