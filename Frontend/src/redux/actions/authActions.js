import axios from "axios";

const BASE = "http://localhost:5000/api/auth";

export const signup = (data) => async (dispatch) => {
  try {
    const res = await axios.post(`${BASE}/signup`, data);
    dispatch({ type: "SIGNUP_SUCCESS", payload: res.data });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

export const login = (data) => async (dispatch) => {
  try {
    const res = await axios.post(`${BASE}/login`, data);
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

export const resetPassword = (data) => async (dispatch) => {
  try {
    const res = await axios.post(`${BASE}/reset-password`, data);
    return { success: true, msg: res.data.msg };
  } catch (err) {
    return { success: false, msg: err.response?.data?.msg || "Error" };
  }
};

export const forgotPasswordSendOTP = (email) => async () => {
  try {
    const res = await axios.post(`${BASE}/forgot-password`, { email });
    return { success: true, msg: res.data.msg };
  } catch (err) {
    return {
      success: false,
      msg: err.response?.data?.msg || "Error sending OTP",
    };
  }
};

export const forgotPasswordVerifyOTP = (email, otp) => async () => {
  try {
    const res = await axios.post(`${BASE}/verify-otp`, { email, otp });
    return { success: true, msg: res.data.msg };
  } catch (err) {
    return { success: false, msg: err.response?.data?.msg || "Invalid OTP" };
  }
};

export const forgotPasswordSetNew = (email, otp, newPassword) => async () => {
  try {
    const res = await axios.post(`${BASE}/set-new-password`, {
      email,
      otp,
      newPassword,
    });
    return { success: true, msg: res.data.msg };
  } catch (err) {
    return {
      success: false,
      msg: err.response?.data?.msg || "Error resetting password",
    };
  }
};
