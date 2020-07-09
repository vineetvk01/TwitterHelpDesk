import express from 'express';
import path from 'path';

import { attachTokenToResponse, mustBeLoggedIn } from '../middleware/authentication';
import { User } from '../User/model';
import { TwitterOauth } from '../Twitter/oauth';
import { sse } from '../app';
import makeLogger from '../logger';

const PUBLIC_URL = path.join(__dirname, '../../public');
const logger = makeLogger('twitter.js');
const route = express.Router();

route.get('/authenticationURL', async (req, res) => {
  try {
    logger.info('Twitter\'s new oauth token is requested for Authentication');
    const urlDetails = await TwitterOauth.makeOauthURL();
    res.status(200).send({
      ...urlDetails
    })
  } catch (e) {
    console.error(e);
    res.sendStatus(500)
  }
})

route.get('/oauth_callback', async (req, res) => {
  try {
    let { query: identity } = req;
    if (identity && identity.denied) {
      logger.info('Twitter Authentication denied by the user...');
      res.sendFile(PUBLIC_URL + '/denied.html');
      return;
    }

    logger.info('Twitter is Authenticated by the user...');

    const twitterUserOauth = await TwitterOauth.makeFromIdentifier(identity);

    logger.info('TwitterOauth is generated for the user...');
    if (!twitterUserOauth) {
      throw new Error('Unable to fetch user from Twitter');
    }

    await twitterUserOauth.fetchAccountInfo();
    logger.info('User Details are fetched from twitter oauth');

    await twitterUserOauth.save();
    logger.info('Twitter handle is persisted.. id : ', twitterUserOauth.id);
    logger.info('Going to create user from twitter oauth...');

    const user = await User.makeFromTwitter(twitterUserOauth);
    console.log('User To be Signed', user.toSession());
    res = attachTokenToResponse(res, user.toSession());

    if (identity && identity.oauth_token && identity.oauth_verifier) {
      res.sendFile(PUBLIC_URL + '/approved.html');
      return;
    }

  } catch (e) {
    const message = e.response && e.response.data || e.message;
    console.log(e.response && e.response.data || e)
    res.status(500).send({
      message
    });
  }
});

route.get('/sub', mustBeLoggedIn, async (req, res) => {
  try {
    const { user: cookieUser } = req;
    const user = new User({ id: cookieUser.id });
    await user.load();

    logger.info('Loaded the user info...', typeof user.twitter);

    const twitterUserOauth = new TwitterOauth({ id: user.twitter });
    await twitterUserOauth.load();
    const subs = await twitterUserOauth.getSubscription();
    res.send({ subs })
  } catch (e) {
    logger.error(e.message);
    res.status(500).send({});
    throw new Error(e);
  }
})

route.get('/sub/new', mustBeLoggedIn, async (req, res) => {
  try {
    const { user: cookieUser } = req;
    const user = new User({ id: cookieUser.id });
    await user.load();

    logger.info('Loaded the user info...', typeof user.twitter);

    const twitterUserOauth = new TwitterOauth({ id: user.twitter });
    await twitterUserOauth.load();
    const subs = await twitterUserOauth.postSubscription();
    res.send({ subs })
  } catch (e) {
    logger.error(e.message);
    res.status(500).send({});
    throw new Error(e);
  }
})

route.get('/webhooks/add', mustBeLoggedIn, async (req, res) => {
  const { user: cookieUser } = req;
  const user = new User({ id: cookieUser.id });
  await user.load();

  logger.info('Loaded the user info...', typeof user.twitter);

  const twitterUserOauth = new TwitterOauth({ id: user.twitter });
  await twitterUserOauth.load();

  const webhooks = await twitterUserOauth.subscribeWebhook();
  res.send({ webhooks })
});

route.get('/webhooks', mustBeLoggedIn, async (req, res) => {
  try {
    const { user: cookieUser } = req;
    const user = new User({ id: cookieUser.id });
    await user.load();

    logger.info('Loaded the user info...', typeof user.twitter);

    const twitterUserOauth = new TwitterOauth({ id: user.twitter });
    await twitterUserOauth.load();
    const webhooks = await twitterUserOauth.getWebhooks();
    res.send({ webhooks })
  } catch (e) {
    console.log(e);
    logger.error(e.message);
    res.status(500).send({});
    throw new Error(e);
  }
})

route.get('/webhooks/delete', mustBeLoggedIn, async (req, res) => {
  const { user: cookieUser } = req;
  const user = new User({ id: cookieUser.id });
  await user.load();

  logger.info('Loaded the user info...', typeof user.twitter);

  const twitterUserOauth = new TwitterOauth({ id: user.twitter });
  await twitterUserOauth.load();

  const webhooks = await twitterUserOauth.getWebhooks();
  //const webhooks = ['sds'];
  logger.info('Active Webhooks : ', webhooks.length);

  if (webhooks.length > 0) {
    const { id } = webhooks[0];
    //const id = '1281225322969497602';
    logger.info('Deleting Webhook with ID : ', id);
    await twitterUserOauth.deleteWebhook(id);
  }
  res.send({ webhooks })
});

/* ALL TWEETS */

route.get('/mentions', mustBeLoggedIn, async (req, res) => {
  const { user: cookieUser } = req;
  const user = new User({ id: cookieUser.id });
  await user.load();

  logger.info('Loaded the user info...', typeof user.twitter);

  const twitterUserOauth = new TwitterOauth({ id: user.twitter });
  await twitterUserOauth.load();

  const mentions = await twitterUserOauth.fetchMentions();

  res.send({ mentions });
});

route.post('/mentions/reply', mustBeLoggedIn, async (req, res) => {
  
  const { user: cookieUser } = req;
  const { tweetId, message } = req.body;
  const user = new User({ id: cookieUser.id });
  await user.load();

  logger.info('Loaded the user info...', typeof user.twitter);

  const twitterUserOauth = new TwitterOauth({ id: user.twitter });
  await twitterUserOauth.load();

  twitterUserOauth.sendReply(tweetId, message);

  res.send({})

});

/* WEBHOOKS */

route.get('/receive', async (req, res) => {
  const { crc_token, nonce } = req.query;
  if (crc_token) {
    const response_token = TwitterOauth.webhookCRCCheck(crc_token);
    res.send({ response_token });
    return;
  }
  res.send({})
});

route.post('/receive', async (req, res) => {
  logger.info('Receiving Webhook Event...')
  const event = req.body;
  TwitterOauth.AddEvent(event);
  const { for_user_id } = event;
  sse.send(parseInt(for_user_id))
  res.send({})
});


export default route;