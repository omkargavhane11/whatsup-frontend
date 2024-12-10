import "./main.css";
import { App } from "./components/App/App";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import socket from "./config/socket.config";
import { useEffect } from "react";
import Register from "./components/Register/Register";
import ProtectedRoute from "./components/ProtectedRoute"
import Chats from "./components/Chats/Chats";
import Contacts from "./components/Contacts/Contacts";
import Profile from "./components/Profile/Profile";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";

function Main() {

  // logged-in user
  const currentUser = JSON.parse(localStorage.getItem("whatsupuser"));
  useEffect(() => {
    socket.connect();
  }, [])

  return (
    <div className="Main">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Private Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/user" element={<App />} />
          <Route path="/user/chats" element={<App />} />
          <Route path="/user/contacts" element={<App />} />
          <Route path="/user/profile" element={<App />} />
          <Route path="/user/chats/:chatId" element={<App />} />
        </Route>
      </Routes>
    </div>
  );
}

export default Main;
