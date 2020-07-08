import { SET_USER, LOGOUT_USER, AUTH_FAILED, CLEAR_ERROR, SIGNUP_ERROR } from './actions';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

const initialState = {
  isLoggedIn: false,
  user: {}
}

const authReducer = ( state = initialState, action) => {
  switch(action.type){
    case SET_USER: return action.payload; 
    case AUTH_FAILED: return {...initialState, error: action.payload};
    case LOGOUT_USER: return initialState; 
    case CLEAR_ERROR: delete state.error; delete state.signupError; return {...state};
    case SIGNUP_ERROR: return {...initialState, signupError: action.payload};
    default: return state; 
  }
}

const persistConfig = { 
  key: 'auth',
  storage,
  blacklist: ['error', 'signupError'],
};

export default persistReducer(persistConfig, authReducer);