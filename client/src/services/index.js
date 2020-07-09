import axios from 'axios';
import { SERVER_URL } from '../constants';

const instance = axios.create({
  withCredentials: true
})

const OAUTH_URL = '/api/twitter/authenticationURL';
const ME_URL = '/api/user/me';
const ALL = '/all';
const TIMELINE = '/api/twitter/mentions';
const LOGOUT = '/api/user/logout';
const REPLY = '/api/twitter/mentions/reply';
const FETCH_AGENTS = '/api/user/agents';
const REGISTER_AGENTS = '/api/user/agent';
const LOGIN_AGENT = '/api/user/agent/login';
const ACTIVATE_LISTENER = 'api/twitter/sub/new';

export const buildTwitterOauthURL = async () => {
  const { data: { oauth_url } } = await instance.get(`${SERVER_URL}${OAUTH_URL}`);
  return oauth_url;
}

export const currentUser = async ({ all } = {}) => {
  try {
    let url = `${SERVER_URL}${ME_URL}`;
    console.log(url);
    if (all) {
      url = url + ALL;
    }
    const { data } = await instance.get(url);
    return data;
  } catch (e) {
    return {};
  }
}

export const fetchMentions = async ({ page = 1, count = 50 } = {}) => {
  let url = `${SERVER_URL}${TIMELINE}?page=${page}&count=${count}`;
  const { data } = await instance.get(url);
  return data;
}

export const logoutUser = async () => {
  const { data } = await instance.get(`${SERVER_URL}${LOGOUT}`, {});
  return {};
}

export const replyToTweet = async (id, message) => {
  const { data } = await instance.post(`${SERVER_URL}${REPLY}`, {
    tweetId: id,
    message
  });
  return data;
};

export const fetchAllAgent = async () => {
  const { data } = await instance.get(`${SERVER_URL}${FETCH_AGENTS}`);
  return data;
}

export const addNewAgent = async (username, password) => {
  const { data } = await instance.post(`${SERVER_URL}${REGISTER_AGENTS}`, {
    username, password
  });
  return data;
}

export const loginAgent = async (username, password) => {
  const { data } = await instance.post(`${SERVER_URL}${LOGIN_AGENT}`, {
    username, password
  });
  return data;
}

export const activateListener = async () => {
  await instance.get(`${SERVER_URL}${ACTIVATE_LISTENER}`);
}