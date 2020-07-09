import { updateOrCreate, findUserById, findUserByCredentials, fetchUserByTwitterId } from './db';
import makeLogger from '../logger';

const logger = makeLogger('user/model.js');

export class User {

  id;
  email;
  password;
  twitter;

  constructor({ id, email, password, twitter }) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.twitter = twitter;
  }

  save = async function () {
    const { id } = await updateOrCreate(this);
    logger.info(' New User created with id: ', id);
    this.id = id;
  }

  load = async function () {
    const userdb = await findUserById(this.id);
    this.email = userdb.email;
    this.twitter = userdb.twitter;
  }

  toSession = function () {
    if (!this.id) {
      throw new Error('Id is required for to String. Please persist the data first.')
    }

    return {
      id: this.id,
      email: this.email,
    };
  }

  login = async function () {
    const data = await findUserByCredentials({ username: this.email, password: this.password });
    if(!data){
      throw new Error('Agent now found');
    }
    this.id = data._id;
    this.twitter = data.twitter;
  }

  addAgent = async function (username, password) {
    const agent = new User({ email: username, password, twitter: this.twitter, })
    const { id } = await updateOrCreate(agent);
    agent.id = id;
    return agent;
  }

  fetchAgents = async function (){
    const admin = this;
    return fetchUserByTwitterId(admin.twitter, admin.email);
  }

  static makeFromTwitter = async function (twitterUser) {
    if (twitterUser.email == null) {
      throw new Error('Email is absent in the user info');
    }

    const user = new User({ email: twitterUser.email, twitter: twitterUser.id });
    if (!user) {
      throw new Error('No user found with the authenticated token.')
    }
    await user.save();
    logger.info('User is persisted...')
    return user;
  }

  static loginAgent = async function ({ username, password }) {
    const { } = await findUserByCredentials({ username, password });
    if (!user) {
      throw new Error('No user found with the credentials')
    }
    const user = new User({ email: twitterUser.email, twitter: { twitter: twitterUser } });
    return user;
  }
}