import axios from "axios";

export const signup = (data) => async (dispatch) => {
  try {
    const res = await axios.post("http://localhost:5000/api/auth/signup", data);

    dispatch({
      type: "SIGNUP_SUCCESS",
      payload: res.data,
    });

    return res.data;
  } catch (err) {
    return err.response.data;
  }
};
export const login = (data) => async (dispatch) => {
  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", data);

    dispatch({
      type: "LOGIN_SUCCESS",
      payload: res.data,
    });

    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

export const resetPassword = (data) => async (dispatch) => {
  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/reset-password",
      data,
    );

    return { success: true, msg: res.data.msg };
  } catch (err) {
    return {
      success: false,
      msg: err.response?.data?.msg || "Error",
    };
  }
};
