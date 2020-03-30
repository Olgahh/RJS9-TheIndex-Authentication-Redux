import { SET_CURRENT_USER } from "./actionTypes";
import decode from "jwt-decode";
import instance from "./instance";

const setCurrenUser = user => ({
  type: SET_CURRENT_USER,
  payload: user
});

export const checkForExpiredToken = () => dispatch => {
  const token = localStorage.getItem("token");
  if (token) {
    const currentTime = Date.now() / 1000;
    //Decode token to get user info
    const user = decode(token);
    console.log((user.exp - currentTime) / 60);
    //check token expiration
    if (user.exp >= currentTime) {
      //set auth token header
      setAuthHeader(token);
      //set user
      dispatch(setCurrenUser(user));
    } else dispatch(logout());
  }
  // if (token) {
  //   setAuthHeader(token);
  //   const user = decode(token);
  //   dispatch({
  //     type: SET_CURRENT_USER,
  //     payload: user
  //   });
  // }
};

const setLocalToken = token => {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
};

const setAuthHeader = token => {
  if (token) instance.defaults.headers.common.Authorization = `JWT ${token}`;
  //setting the token in the authorization header of the instance
  else delete instance.defaults.headers.common.Authorization;
};

export const login = userData => async dispatch => {
  try {
    let res = await instance.post("/login/", userData);
    let { token } = res.data;
    setAuthHeader(token);
    //setting token after successful login
    setLocalToken(setLocalToken);
    const user = decode(token);
    dispatch(setCurrenUser(user));
  } catch (err) {
    console.log("An error occurred while login", err);
  }
};

export const signup = userData => async dispatch => {
  try {
    let res = await instance.post("/signup/", userData);
    let { token } = res.data;
    setAuthHeader(token);
    setLocalToken(token);
    const user = decode(token);
    dispatch(setCurrenUser(user));
  } catch (err) {
    console.log("An error occurred while signup", err);
  }
};

export const logout = () => {
  setAuthHeader(null);
  setLocalToken(null);
  return setCurrenUser(null);
};
