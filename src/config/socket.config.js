// src/socket.js
import { io } from "socket.io-client";
import { SOCKET_API } from "../constant";

const currentUser = JSON.parse(localStorage.getItem("whatsupuser"));

const socket = io(SOCKET_API,
  {
    query: { userId: currentUser?._id || null, userName: currentUser?.name },
    autoConnect: false
  }
);

export default socket;
