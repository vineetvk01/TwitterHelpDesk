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
  const db = await makeDb();
  await db.collection('timeline').insertOne({
    user_id,
    tweet
  })
};

export const fetchTweets = async (user_id) => {
  const db = await makeDb();
  const result = await db.collection('timeline').find({user_id});
  return (await result.toArray()).reverse();
};

// export const createOrUpdateTweets = async (tweets = []) => {
//   const db = await makeDb();

//   if (!tweets || tweets.length === 0) {
//     throw new Error('No Tweets found');
//   }

//   const ids = [];
//   const tweetsToPersist = tweets.map((tweet) => {
//     tweet._id = tweet.id;
//     ids.push(tweet._id);
//     delete tweet.id;
//   })

//   try {
//     await db.collection('timeline').insertMany(tweets, { ordered: false }).catch((e) => { console.log(e.message); });
//     const tweetsFetched = await db.collection('timeline').find({ _id: { $in: ids } });
//     return tweetsFetched.toArray();
//   } catch (e) {
//     console.error(e)
//   }

// }

// export const fetchTweetsByUserId = async (userId, { page = 1, count = 50, location, hashtags }) => {
//   const db = await makeDb();
//   const query = { byUser: userId };
//   if (location) {
//     query.location = location;
//   }
//   if (hashtags && hashtags.length > 0) {
//     query.hashtags = { $elemMatch: { text: { $in: hashtags } } };
//   }
//   const skip = (page - 1) * count;
//   console.log(skip, count);

//   const data = await db.collection('timeline').find(query).sort({ _id: -1 }).skip(skip).limit(parseInt(count));
//   const tweets = await data.toArray();

//   const total = await db.collection('timeline').find(query).count();

//   return {
//     tweets, total
//   }
// }

// export const groupByUserName = async (count = 5) => {
//   const db = await makeDb();
//   const data = await db.collection('timeline').aggregate([
//     { $group: { _id: "$name", count: { $sum: 1 } } },
//     { $sort: { count: -1 } },
//     {
//       $project: { _id: 0, name: "$_id", count: 1 }
//     }
//   ]).limit(count)
//   return data.toArray();
// }

// export const fetchAllURLs = async (count = 5) => {
//   const db = await makeDb();
//   const data = await db.collection('timeline').find({}, { fields: { _id: 0, urls: 1 } });
//   return data.toArray();
// }