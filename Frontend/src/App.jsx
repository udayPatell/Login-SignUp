// import React from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import Login from "./components/Login";
// import SignUp from "./components/SignUp";
// import ResetPassword from "./components/ResetPassword";
// import RequestReset from "./components/RequestReset";
// import ForgotPassword from "./components/ForgotPassword";
// import Dashboard from "./components/Dashboard";
// import ChangePassword from "./components/ChangePassword";
// import { ToastContainer } from "react-toastify";
// import "./App.css";

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Navigate to="/login" replace />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<SignUp />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/request-reset" element={<RequestReset />} />
//         <Route path="/reset-password" element={<ResetPassword />} />
//         <Route path="/change-password" element={<ChangePassword />} />
//         <Route path="*" element={<Navigate to="/login" replace />} />
//       </Routes>
//       <ToastContainer />
//     </Router>
//   );
// };

// export default App;
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ResetPassword from "./components/ResetPassword";
import RequestReset from "./components/RequestReset";
import ForgotPassword from "./components/ForgotPassword";
import ChangePassword from "./components/ChangePassword";
import Dashboard from "./components/Dashboard";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/request-reset" element={<RequestReset />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
