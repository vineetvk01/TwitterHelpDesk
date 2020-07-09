import { SET_USER, LOGOUT_USER, AUTH_FAILED, CLEAR_ERROR, SIGNUP_ERROR } from './actions';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

const initialState = {
  isLoggedIn: false,
  user: {}
}

const authReducer = ( state = initialState, action) => {
  console.log('Type', action.type, 'Payload : ', action.payload);
  switch(action.type){
    case SET_USER: return action.payload; 
    case LOGOUT_USER: return initialState; 
    default: return state; 
  }
}

const persistConfig = { 
  key: 'auth',
  storage,
  blacklist: ['error', 'signupError'],
};

export default persistReducer(persistConfig, authReducer);