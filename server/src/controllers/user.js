import express from 'express';
import { User } from '../User/model';
import { TwitterOauth } from '../Twitter/oauth';
import { attachTokenToResponse, removeTokenToResponse, mustBeLoggedIn } from '../middleware/authentication';
import makeLogger from '../logger';

const logger = makeLogger('user.js');

const route = express.Router();

route.get('/me', mustBeLoggedIn, async (req, res) => {
  try {
    const { user: cookieUser } = req;
    const user = new User({ id: cookieUser.id });
    await user.load();

    const twitterUserOauth = new TwitterOauth({ id: user.twitter });
    await twitterUserOauth.load();

    res.status(200).send({
      user,
      twitterUserOauth
    });
  } catch (e) {
    res.status(500).send({
      message: e.message
    })
  }
});

route.post('/login', async (req, res) => {
  const { user: { username, password } } = req.body;
  const user = await User.loginAgent({ username, password });
  res = attachTokenToResponse(res, user.toSession());
  res.send({});
});

route.get('/logout', (req, res) => {
  try {
    console.log('Logout is requested')
    res = removeTokenToResponse(res);
    res.sendStatus(200);
  } catch (e) {
    res.status(500).send({
      message: e.message
    })
  }
})

route.post('/agent', async (req, res) => {
  try {
    const { user: cookieUser, body } = req;
    const user = new User({ id: cookieUser.id });
    await user.load();

    const { username, password } = body;
    const agent = await user.addAgent(username, password);
    res.send(agent);
  } catch (e) {
    console.log(e);
    res.status(401).send({
      message: e.message
    })
  }
})

route.get('/agents', mustBeLoggedIn, async (req, res) => {
  try {
    logger.info('Going to fetch all agent of the admin')
    const { user: cookieUser, body } = req;
    const user = new User({ id: cookieUser.id });
    await user.load();

    const agent = await user.fetchAgents();
    res.send(agent);
  } catch (e) {
    console.log(e);
    res.status(401).send({
      message: e.message
    })
  }
})

route.post('/agent/login', async (req, res)=>{
  try {
    logger.info('Going to login an agent')
    const { username, password } = req.body;
    const agent = new User({email: username, password});
    await agent.login();

    logger.info('User To be Signed', agent.toSession());
    res = attachTokenToResponse(res, agent.toSession());

    res.send({success: true})

  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: e.message
    })
  }
})


export default route;