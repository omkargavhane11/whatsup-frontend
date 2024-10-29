// src/socket.js
import { io } from "socket.io-client";

const socket = io(
  window.location.host === "localhost:3000"
    ? "ws://localhost:8080"
    : "https://whatsup-api-production.up.railway.app",
  // {
  //   autoConnect: false, // Prevent automatic connection
  // }
);

export default socket;
