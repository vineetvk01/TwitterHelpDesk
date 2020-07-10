import axios from 'axios';
import { Timeline } from './model';
import { hashHMACSHA1, base64String, objectFromString } from '../utils';
import {
  saveNewOauthToken,
  updateOauthToken,
  twitterUserExists,
  deleteOauthToken,
  fetchTwitterOauthById,
  createTweet,
  fetchTweets
} from './db';
import btoa from 'btoa';
import makeLogger from '../logger';
import crypto from 'crypto';

const logger = makeLogger('Oauth.js');


const TWITTER_API_URL = 'https://api.twitter.com';
const TWITTER_CLIENT_OAUTH = '/oauth/authorize';

const VERIFY_CREDENTIALS = {
  url: '/1.1/account/verify_credentials.json',
  method: 'get',
  headers: ['oauth_signature_method', 'oauth_timestamp', 'oauth_consumer_key', 'oauth_version']
}

const REQUEST_TOKEN = {
  url: '/oauth/request_token',
  method: 'post',
  headers: ['oauth_callback', 'oauth_signature_method', 'oauth_timestamp', 'oauth_consumer_key', 'oauth_version']
}

const ACCESS_TOKEN = {
  url: '/oauth/access_token',
  method: 'post',
  headers: ['oauth_signature_method', 'oauth_timestamp', 'oauth_consumer_key', 'oauth_version', 'oauth_token']
}

const BEARER_TOKEN = {
  url: '/oauth2/token',
  method: 'post',
}

const MENTIONS_TIMELINE = {
  url: '/1.1/statuses/mentions_timeline.json',
  method: 'get',
  headers: ['oauth_signature_method', 'oauth_timestamp', 'oauth_consumer_key', 'oauth_version']
}

const REGISTER_WEBHOOK = {
  url: '/1.1/account_activity/all/Dev/webhooks.json',
  method: 'post',
  headers: ['oauth_signature_method', 'oauth_timestamp', 'oauth_consumer_key', 'oauth_version']
};

const GET_WEBHOOKS = {
  url: '/1.1/account_activity/all/Dev/webhooks.json',
  method: 'get',
  headers: ['oauth_signature_method', 'oauth_timestamp', 'oauth_consumer_key', 'oauth_version']
}

const GET_SUBSCRIPTION = {
  url: '/1.1/account_activity/all/subscriptions/count.json',
  method: 'get',
  headers: ['oauth_signature_method', 'oauth_timestamp', 'oauth_consumer_key', 'oauth_version']
}

const POST_SUBSCRIPTION = {
  url: '/1.1/account_activity/all/Dev/subscriptions.json',
  method: 'post',
  headers: ['oauth_signature_method', 'oauth_timestamp', 'oauth_consumer_key', 'oauth_version']
}

const REPLY_TWEET = {
  url: '/1.1/statuses/update.json',
  method: 'post',
  headers: ['oauth_signature_method', 'oauth_timestamp', 'oauth_consumer_key', 'oauth_version']
}

export class TwitterOauth {

  static consumerKey = process.env.TWITTER_CONSUMER_KEY;
  static consumerSecret = process.env.TWITTER_CONSUMER_SECRET;
  static callback = process.env.OAUTH_CALLBACK_URL;
  static access_token_secret = process.env.ACCESS_TOKEN_SECRET;
  static access_token = process.env.ACCESS_TOKEN;

  constructor({ id, screen_name, user_id, user_oauth_token, user_oauth_token_secret, oauth_token }) {
    this.id = id;
    this.screen_name = screen_name;
    this.user_id = user_id;
    this.oauth_token = oauth_token;
    this.user_oauth_token = user_oauth_token;
    this.user_oauth_token_secret = user_oauth_token_secret;
  }

  static signOauthHeaders = (request, oauthHeaders, access_token_secret = '') => {
    const completeURL = `${TWITTER_API_URL}${request.url}`;
    const method = request.method && request.method.toUpperCase();
    const completeUnsignedRequest = `${method}&${encodeURIComponent(completeURL)}&${encodeURIComponent(oauthHeaders)}`;
    const key = `${encodeURIComponent(TwitterOauth.consumerSecret)}&${encodeURIComponent(access_token_secret)}`;
    const signedOauth = hashHMACSHA1(completeUnsignedRequest, key);
    return encodeURIComponent(base64String(signedOauth));
  }


  static generate(key) {
    switch (key) {
      case 'oauth_callback': return TwitterOauth.callback;
      case 'oauth_consumer_key': return TwitterOauth.consumerKey;
      case 'oauth_nonce': return btoa(`${TwitterOauth.consumerKey}${Math.floor(Date.now() / 1000)}`)
      case 'oauth_timestamp': return Math.floor(Date.now() / 1000);
      case 'oauth_version': return '1.0';
      case 'oauth_signature_method': return "HMAC-SHA1";
      default: return '';
    }
  }

  static makeOauthURL = async function () {
    try {
      const oauth_nonce = encodeURIComponent(TwitterOauth.generate('oauth_nonce'));
      const _auth_String = REQUEST_TOKEN.headers.map((key) => {
        return `${key}=${encodeURIComponent(TwitterOauth.generate(key))}`
      })
      _auth_String.push(`oauth_nonce=${oauth_nonce}`);

      const oauth_signature = TwitterOauth.signOauthHeaders(REQUEST_TOKEN, _auth_String.sort().join('&'));
      const auth_String = REQUEST_TOKEN.headers.map((key) => {
        return `${key}="${encodeURIComponent(TwitterOauth.generate(key))}"`
      })
      auth_String.push(`oauth_signature="${oauth_signature}"`);
      auth_String.push(`oauth_nonce="${oauth_nonce}"`);

      const oauth = auth_String.sort().join(',');
      const response = await axios[REQUEST_TOKEN.method](`${TWITTER_API_URL}${REQUEST_TOKEN.url}`, {}, {
        headers: {
          'Authorization': `OAuth ${oauth}`
        }
      });

      const { data } = response;

      const obj = objectFromString(data);
      obj.id = await saveNewOauthToken(obj);
      obj.oauth_url = `${TWITTER_API_URL}${TWITTER_CLIENT_OAUTH}?oauth_token=${obj.oauth_token}`;
      return obj;


    } catch (e) {
      console.log(e.response && e.response.data || e)
    }
  }

  static makeFromIdentifier = async function (identity) {
    try {
      const oauth_nonce = encodeURIComponent(TwitterOauth.generate('oauth_nonce'));
      const _auth_String = REQUEST_TOKEN.headers.map((key) => {
        return `${key}=${encodeURIComponent(TwitterOauth.generate(key))}`
      })
      _auth_String.push(`oauth_nonce=${oauth_nonce}`);
      _auth_String.push(`oauth_verifier=${identity.oauth_verifier}`);
      _auth_String.push(`oauth_token=${identity.oauth_token}`);

      const oauth_signature = TwitterOauth.signOauthHeaders(ACCESS_TOKEN, _auth_String.sort().join('&'));

      const auth_String = REQUEST_TOKEN.headers.map((key) => {
        return `${key}="${encodeURIComponent(TwitterOauth.generate(key))}"`
      })
      auth_String.push(`oauth_signature="${oauth_signature}"`);
      auth_String.push(`oauth_nonce="${oauth_nonce}"`);

      const oauth = auth_String.sort().join(',');

      const response = await axios[ACCESS_TOKEN.method](`${TWITTER_API_URL}${ACCESS_TOKEN.url}?oauth_token=${identity.oauth_token}&oauth_verifier=${identity.oauth_verifier}`, {}, {
        headers: {
          'Authorization': `OAuth ${oauth}`
        }
      });

      const { data } = response;
      const { screen_name, user_id, oauth_token, oauth_token_secret } = objectFromString(data);

      return new TwitterOauth({
        screen_name, user_id,
        user_oauth_token: oauth_token,
        user_oauth_token_secret: oauth_token_secret,
        oauth_token: identity.oauth_token
      });

    } catch (e) {
      console.log('error', e)
      console.log(e.response.data || e);
    }
  }

  static generateBearerToken = async function () {
    logger.debug('Going to create bearer token');

    const basic = btoa(`${TwitterOauth.consumerKey}:${TwitterOauth.consumerSecret}`);
    const body = 'grant_type=client_credentials';
    const response = await axios[BEARER_TOKEN.method](`${TWITTER_API_URL}${BEARER_TOKEN.url}`, body, {
      headers: {
        'Authorization': `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    });
    return response.data;
  };

  static webhookCRCCheck = function (crc_token) {
    const hmac = crypto.createHmac('sha256', TwitterOauth.consumerSecret).update(crc_token).digest('base64');
    return `sha256=${hmac}`;
  }

  static AddEvent = async function (event) {
    const { for_user_id, tweet_create_events = [] } = event;
    const mentioned = new Set();
    tweet_create_events.forEach(async (event) => {    
      if (event.entities.user_mentions.length > 0 ) {
        event.entities.user_mentions.forEach((mention) => mentioned.add(mention.screen_name));
        await createTweet(for_user_id, event);
      }
    })
    return Array.from(mentioned);
  }

  fetchPreviousMentions = async function (){
    try {
      const oauth_nonce = encodeURIComponent(TwitterOauth.generate('oauth_nonce'));
      const _auth_String = MENTIONS_TIMELINE.headers.map((key) => {
        return `${key}=${encodeURIComponent(TwitterOauth.generate(key))}`
      })
      _auth_String.push(`oauth_nonce=${oauth_nonce}`);
      _auth_String.push(`oauth_token=${this.user_oauth_token}`);
      _auth_String.push(`count=10`);

      const oauth_signature = TwitterOauth.signOauthHeaders(MENTIONS_TIMELINE, _auth_String.sort().join('&'), this.user_oauth_token_secret);
      //console.log('Signed Oauth: ', oauth_signature);
      const auth_String = MENTIONS_TIMELINE.headers.map((key) => {
        return `${key}="${encodeURIComponent(TwitterOauth.generate(key))}"`
      })
      auth_String.push(`oauth_signature="${oauth_signature}"`);
      auth_String.push(`oauth_nonce="${oauth_nonce}"`);
      auth_String.push(`oauth_token="${this.user_oauth_token}"`);

      const oauth = auth_String.sort().join(',');
      const response = await axios.get(`${TWITTER_API_URL}${MENTIONS_TIMELINE.url}?count=10`, {
        headers: {
          'Authorization': `OAuth ${oauth}`
        }
      });

      const { data } = response;
      const persistTweets = data.map((item) => {
        return createTweet(this.user_id , item);
      });

      return Promise.all(persistTweets);

    }catch(e){
      return [];
    }
  }

  fetchMentions = async function () {
    const mentions =  await fetchTweets(this.user_id);
    if(mentions.length !== 0){
      return mentions;
    }
    logger.info('New user, fetching previous mentions before returning')
    await this.fetchPreviousMentions();
    return fetchTweets(this.user_id);
  }

  fetchAccountInfo = async function () {
    try {
      const oauth_nonce = encodeURIComponent(TwitterOauth.generate('oauth_nonce'));
      const _auth_String = VERIFY_CREDENTIALS.headers.map((key) => {
        return `${key}=${encodeURIComponent(TwitterOauth.generate(key))}`
      })
      _auth_String.push(`oauth_nonce=${oauth_nonce}`);
      _auth_String.push(`oauth_token=${this.user_oauth_token}`);
      _auth_String.push(`include_email=true`);

      const oauth_signature = TwitterOauth.signOauthHeaders(VERIFY_CREDENTIALS, _auth_String.sort().join('&'), this.user_oauth_token_secret);
      //console.log('Signed Oauth: ', oauth_signature);
      const auth_String = VERIFY_CREDENTIALS.headers.map((key) => {
        return `${key}="${encodeURIComponent(TwitterOauth.generate(key))}"`
      })
      auth_String.push(`oauth_signature="${oauth_signature}"`);
      auth_String.push(`oauth_nonce="${oauth_nonce}"`);
      auth_String.push(`oauth_token="${this.user_oauth_token}"`);

      const oauth = auth_String.sort().join(',');
      const response = await axios.get(`${TWITTER_API_URL}${VERIFY_CREDENTIALS.url}?include_email=true`, {
        headers: {
          'Authorization': `OAuth ${oauth}`
        }
      });

      const { data } = response;
      const { id, name, screen_name, location, description, profile_image_url, email } = data;
      this.twitter_id = id;
      this.name = name;
      this.screen_name = screen_name;
      this.location = location;
      this.description = description;
      this.profile_image_url = profile_image_url;
      this.email = email;

    } catch (e) {
      console.log(e.response.data);
    }
  }

  sendReply = async function (tweetId, message) {
    try {
      const oauth_nonce = encodeURIComponent(TwitterOauth.generate('oauth_nonce'));
      const _auth_String = REPLY_TWEET.headers.map((key) => {
        return `${key}=${encodeURIComponent(TwitterOauth.generate(key))}`
      })
      _auth_String.push(`oauth_nonce=${oauth_nonce}`);
      _auth_String.push(`oauth_token=${this.user_oauth_token}`);
      _auth_String.push(`in_reply_to_status_id_str=${tweetId}`);
      _auth_String.push(`status=${encodeURIComponent(message)}`);
      _auth_String.push(`auto_populate_reply_metadata=true`);

      const oauth_signature = TwitterOauth.signOauthHeaders(REPLY_TWEET, _auth_String.sort().join('&'), this.user_oauth_token_secret);
      //console.log('Signed Oauth: ', oauth_signature);
      const auth_String = REPLY_TWEET.headers.map((key) => {
        return `${key}="${encodeURIComponent(TwitterOauth.generate(key))}"`
      })
      auth_String.push(`oauth_signature="${oauth_signature}"`);
      auth_String.push(`oauth_nonce="${oauth_nonce}"`);
      auth_String.push(`oauth_token="${this.user_oauth_token}"`);

      const oauth = auth_String.sort().join(',');
      console.log('This', oauth)
      console.log('This', `${TWITTER_API_URL}${REPLY_TWEET.url}?auto_populate_reply_metadata=true&in_reply_to_status_id=${tweetId}&status=${encodeURIComponent(message)}`)
      const response = await axios.post(`${TWITTER_API_URL}${REPLY_TWEET.url}?in_reply_to_status_id_str=${tweetId}&auto_populate_reply_metadata=true&status=${encodeURIComponent(message)}`, '', {
        headers: {
          'authorization': `OAuth ${oauth}`
        }
      });



      const { data } = response;

      console.log('Reply', data);
    } catch (e) {
      console.log(e.response.data);
    }
  }

  getWebhooks = async function () {
    logger.info('Getting webhooks for the users...');

    const { access_token: bearerToken } = await TwitterOauth.generateBearerToken();

    const response = await axios.get(`${TWITTER_API_URL}${GET_WEBHOOKS.url}`, {
      headers: {
        'authorization': `Bearer ${bearerToken}`
      }
    });
    return response.data
  }

  getSubscription = async function () {
    try {
      const oauth_nonce = encodeURIComponent(TwitterOauth.generate('oauth_nonce'));
      const _auth_String = GET_SUBSCRIPTION.headers.map((key) => {
        return `${key}=${encodeURIComponent(TwitterOauth.generate(key))}`
      })
      _auth_String.push(`oauth_nonce=${oauth_nonce}`);
      _auth_String.push(`oauth_token=${this.user_oauth_token}`);

      const oauth_signature = TwitterOauth.signOauthHeaders(GET_SUBSCRIPTION, _auth_String.sort().join('&'), this.user_oauth_token_secret);

      const auth_String = GET_SUBSCRIPTION.headers.map((key) => {
        return `${key}="${encodeURIComponent(TwitterOauth.generate(key))}"`
      })
      auth_String.push(`oauth_signature="${oauth_signature}"`);
      auth_String.push(`oauth_nonce="${oauth_nonce}"`);
      auth_String.push(`oauth_token="${this.user_oauth_token}"`);

      const oauth = auth_String.sort().join(',');
      console.log(`${TWITTER_API_URL}${GET_SUBSCRIPTION.url}`);
      console.log(oauth);
      const response = await axios.get(`${TWITTER_API_URL}${GET_SUBSCRIPTION.url}`, {
        headers: {
          'authorization': `OAuth ${oauth}`
        }
      });

      const { data } = response;
      console.log(data);
    } catch (e) {
      console.log(e.response.data);
    }
  }

  postSubscription = async function () {
    try {
      const oauth_nonce = encodeURIComponent(TwitterOauth.generate('oauth_nonce'));
      const _auth_String = POST_SUBSCRIPTION.headers.map((key) => {
        return `${key}=${encodeURIComponent(TwitterOauth.generate(key))}`
      })
      _auth_String.push(`oauth_nonce=${oauth_nonce}`);
      _auth_String.push(`oauth_token=${this.user_oauth_token}`);

      const oauth_signature = TwitterOauth.signOauthHeaders(POST_SUBSCRIPTION, _auth_String.sort().join('&'), this.user_oauth_token_secret);

      const auth_String = POST_SUBSCRIPTION.headers.map((key) => {
        return `${key}="${encodeURIComponent(TwitterOauth.generate(key))}"`
      })
      auth_String.push(`oauth_signature="${oauth_signature}"`);
      auth_String.push(`oauth_nonce="${oauth_nonce}"`);
      auth_String.push(`oauth_token="${this.user_oauth_token}"`);

      const oauth = auth_String.sort().join(',');
      console.log(`${TWITTER_API_URL}${POST_SUBSCRIPTION.url}`);
      console.log(oauth);
      const response = await axios.post(`${TWITTER_API_URL}${POST_SUBSCRIPTION.url}`, '', {
        headers: {
          'authorization': `OAuth ${oauth}`
        }
      });

      const { data } = response;
      console.log(data);
    } catch (e) {
      console.log(e.response.data);
    }
  }

  subscribeWebhook = async function () {
    try {
      const hook = `${process.env.SERVER_URL}/api/twitter/receive`;
      const oauth_nonce = encodeURIComponent(TwitterOauth.generate('oauth_nonce'));
      const _auth_String = REGISTER_WEBHOOK.headers.map((key) => {
        return `${key}=${encodeURIComponent(TwitterOauth.generate(key))}`
      })
      _auth_String.push(`oauth_nonce=${oauth_nonce}`);
      _auth_String.push(`oauth_token=${this.user_oauth_token}`);
      _auth_String.push(`url=${encodeURIComponent(hook)}`);

      const oauth_signature = TwitterOauth.signOauthHeaders(REGISTER_WEBHOOK, _auth_String.sort().join('&'), this.user_oauth_token_secret);

      const auth_String = REGISTER_WEBHOOK.headers.map((key) => {
        return `${key}="${encodeURIComponent(TwitterOauth.generate(key))}"`
      })
      auth_String.push(`oauth_signature="${oauth_signature}"`);
      auth_String.push(`oauth_nonce="${oauth_nonce}"`);
      auth_String.push(`oauth_token="${this.user_oauth_token}"`);

      const oauth = auth_String.sort().join(',');
      console.log(`${TWITTER_API_URL}${REGISTER_WEBHOOK.url}?url=${encodeURIComponent(hook)}`);
      console.log(oauth);

      const response = await axios.post(`${TWITTER_API_URL}${REGISTER_WEBHOOK.url}?url=${encodeURIComponent(hook)}`, '', {
        headers: {
          'authorization': `OAuth ${oauth}`
        }
      });

      const { data } = response;
      console.log(data);
    } catch (e) {
      console.log(e.response.data);
    }
  }

  deleteWebhook = async function (id) {

    const DELETE_WEBHOOK = { ...REGISTER_WEBHOOK };
    DELETE_WEBHOOK.url = DELETE_WEBHOOK.url.slice(0, -5) + `/${id}.json`;
    DELETE_WEBHOOK.method = 'delete';

    try {
      const hook = `${process.env.SERVER_URL}/api/twitter/receive`;
      logger.info('Hook : ', hook);
      const oauth_nonce = encodeURIComponent(TwitterOauth.generate('oauth_nonce'));
      const _auth_String = DELETE_WEBHOOK.headers.map((key) => {
        return `${key}=${encodeURIComponent(TwitterOauth.generate(key))}`
      })
      _auth_String.push(`oauth_nonce=${oauth_nonce}`);
      _auth_String.push(`oauth_token=${this.user_oauth_token}`);
      _auth_String.push(`url=${encodeURIComponent(hook)}`);

      const oauth_signature = TwitterOauth.signOauthHeaders(DELETE_WEBHOOK, _auth_String.sort().join('&'), this.user_oauth_token_secret);

      const auth_String = DELETE_WEBHOOK.headers.map((key) => {
        return `${key}="${encodeURIComponent(TwitterOauth.generate(key))}"`
      })
      auth_String.push(`oauth_signature="${oauth_signature}"`);
      auth_String.push(`oauth_nonce="${oauth_nonce}"`);
      auth_String.push(`oauth_token="${this.user_oauth_token}"`);

      const oauth = auth_String.sort().join(',');
      console.log(`${TWITTER_API_URL}${DELETE_WEBHOOK.url}?url=${encodeURIComponent(hook)}`);
      console.log(oauth);

      const response = await axios.delete(`${TWITTER_API_URL}${DELETE_WEBHOOK.url}?url=${encodeURIComponent(hook)}`, {
        headers: {
          'authorization': `OAuth ${oauth}`
        }
      });

      logger.info('RESPONSE CODE : ', response.status);

      const { data } = response;
      console.log(data);
    } catch (e) {
      console.log(e.response.data);
    }
  }

  save = async function () {
    logger.debug('Checking User already exists : ', this.user_id);
    if (await twitterUserExists({ user_id: this.user_id })) {
      logger.info('Twitter user already exists..');
      await deleteOauthToken({ oauth_token: this.oauth_token })
      this.id = await updateOauthToken({ user_id: this.user_id }, this)
      return;
    }
    logger.info('Creating new Twitter user...');
    this.id = await updateOauthToken({ oauth_token: this.oauth_token }, this);
  }

  load = async function () {
    logger.info('Loading twitter oauth info..');
    const {
      twitter_id,
      name,
      screen_name,
      location,
      description,
      profile_image_url,
      email,
      user_id,
      oauth_token,
      user_oauth_token,
      user_oauth_token_secret
    } = await fetchTwitterOauthById(this.id);

    this.twitter_id = twitter_id;
    this.name = name;
    this.screen_name = screen_name;
    this.location = location;
    this.description = description;
    this.profile_image_url = profile_image_url;
    this.email = email;
    this.user_id = user_id;
    this.oauth_token = oauth_token;
    this.user_oauth_token = user_oauth_token;
    this.user_oauth_token_secret = user_oauth_token_secret;
  }

}