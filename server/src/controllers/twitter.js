import express from 'express';
import path from 'path';

import { attachTokenToResponse, mustBeLoggedIn } from '../middleware/authentication';
import { User } from '../User/model';
import { TwitterOauth } from '../Twitter/oauth';
import { Timeline } from '../Twitter/model';
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
    logger.error(e.message);
    res.status(500).send({});
    throw new Error(e);
  }
})

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

route.get('/webhooks/s', mustBeLoggedIn, async (req, res) => {
  const { user: cookieUser } = req;
  const user = new User({ id: cookieUser.id });
  await user.load();

  logger.info('Loaded the user info...', typeof user.twitter);

  const twitterUserOauth = new TwitterOauth({ id: user.twitter });
  await twitterUserOauth.load();

  const webhooks = await twitterUserOauth.subscribeWebhook();
  res.send({ webhooks })
});

route.get('/webhooks/d', mustBeLoggedIn, async (req, res) => {
  const { user: cookieUser } = req;
  const user = new User({ id: cookieUser.id });
  await user.load();

  logger.info('Loaded the user info...', typeof user.twitter);

  const twitterUserOauth = new TwitterOauth({ id: user.twitter });
  await twitterUserOauth.load();

  const webhooks = await twitterUserOauth.subscribeWebhook();
  res.send({ webhooks })
});

route.get('/receive', async (req, res) => {
  const { crc_token, nonce } = req.query;
  const response_token = TwitterOauth.webhookCRCCheck(crc_token);
  res.send({response_token})
})

route.post('/receive', async (req, res) => {
  logger.info('Receiving')
  logger.info(req.body);
  res.send({})
})


export default route;