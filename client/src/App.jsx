import React from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import { Toaster } from "react-hot-toast";
import useAuthStore from "./store/useAuthStore";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import ForgetPass from "./Pages/ForgetPass";
import useTaskStore from "./store/useTaskStore";

const App = () => {
  const location = useLocation();
  const { authUser, checkAuth } = useAuthStore();
  const {  getAllTasks } = useTaskStore();


  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/forget";

  useEffect(() => {
    checkAuth();
    getAllTasks();
  }, [checkAuth , getAllTasks]);
  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />

        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/" />}
        />
        <Route
          path="/forget"
          element={!authUser ? <ForgetPass /> : <Navigate to="/" />}
        />
      </Routes>

      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default App;
