const initialState = {
  token: localStorage.getItem("token"),
  user: null,
  isAuthenticated: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
      };

    case "LOGOUT":
      localStorage.removeItem("token");
      return initialState;

    default:
      return state;
  }
};

export default authReducer;
