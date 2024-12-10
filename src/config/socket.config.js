// src/socket.js
import { io } from "socket.io-client";

const currentUser = JSON.parse(localStorage.getItem("whatsupuser"));

const socket = io(
  window.location.host === "localhost:3000"
    ? "ws://localhost:8080"
    : "https://whatsup-api-production.up.railway.app",
  {
    query: { userId: currentUser?._id || null, userName: currentUser?.name },
    autoConnect: false
  }
);

export default socket;
