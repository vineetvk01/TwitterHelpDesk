import { updateOrCreate, findUserById, findUserByCredentials } from './db';
import makeLogger from '../logger';

const logger = makeLogger('user/model.js');

export class User {

  id;
  email;
  password;
  twitter;

  constructor({ id, email, twitter }) {
    this.id = id;
    this.email = email;
    this.twitter = twitter;
  }

  save = async function(){
    const { id } = await updateOrCreate(this);
    logger.info(' New User created with id: ', id);
    this.id = id;
  }

  load = async function(){
    const userdb = await findUserById(this.id);
    this.email = userdb.email;
    this.twitter = userdb.twitter;
  }

  toSession = function(){
    if(!this.id){
      throw new Error('Id is required for to String. Please persist the data first.')
    }

    return {
      id: this.id,
      email: this.email,
    };
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

  static loginAgent = async function({username, password}){
    const {} = await findUserByCredentials({username, password});
    if(!user){
      throw new Error('No user found with the credentials')
    }
    const user = new User({ email: twitterUser.email, twitter: { twitter: twitterUser } });
    return user;
  }
}