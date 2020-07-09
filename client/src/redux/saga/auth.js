import { takeLatest, put, call } from 'redux-saga/effects';

import { setUserAction, unsetUserAction, authFailedAction, setSignupErrorAction } from '../reducers/auth';
import { AUTH_REQUEST, FETCH_USER, LOGOUT_REQUEST, SIGNUP_REQUEST } from '../reducers/auth';
import { currentUser, logoutUser, userAuthStatus, signupUser } from '../../services';


//Worker Saga

function* fetchAuthenticatedUser({ type, payload = {} }) {
  const data = yield call(currentUser, payload);
  
  if (Object.keys(data).includes('user')) {
    yield put(setUserAction(data));
  } else {
    yield put(unsetUserAction());
  }
}

function* authRequestWorker({ type, payload = {}}){
  const data = yield call(logoutUser, payload);
  yield put(unsetUserAction());
}

//Watcher Saga 
export function* watchAuthRequest() {
  // yield takeLatest(AUTH_REQUEST, authRequestWorker);
  yield takeLatest(LOGOUT_REQUEST, authRequestWorker);
  yield takeLatest(FETCH_USER, fetchAuthenticatedUser);
  // yield takeLatest(SIGNUP_REQUEST, signupWorker);
}