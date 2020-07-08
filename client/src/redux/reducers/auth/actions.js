

export const FETCH_USER = 'FETCH_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const AUTH_REQUEST = 'AUTH_REQUEST';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const AUTH_FAILED = 'AUTH_FAILED';
export const SET_USER = 'SET_USER';
export const CLEAR_ERROR = 'CLEAR_ERROR';
export const SIGNUP_REQUEST = 'SIGNUP_REQUEST';
export const SIGNUP_ERROR = 'SIGNUP_ERROR';

export const authRequestAction = (user = { username: '', password: '' }) => ({
  type: AUTH_REQUEST,
  payload: user,
});

export const setUserAction = (user) => ({
type: SET_USER,
payload: { isLoggedIn:true, user},
});

export const logoutRequestAction = () => ({
type: LOGOUT_REQUEST,
})

export const authFailedAction = (error) => ({
type: AUTH_FAILED,
payload: { error }
})

export const unsetUserAction = () => ({
type: LOGOUT_USER,
})

export const signupAction = (user) => ({
type: SIGNUP_REQUEST,
payload: user
})

export const setSignupErrorAction = (error) => ({
type: SIGNUP_ERROR,
payload: { error }
})