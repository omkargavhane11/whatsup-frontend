export const API =
    window.location.host === "localhost:3000"
        ? "http://localhost:8080"
        : "https://whatsup-api-production.up.railway.app";

export const SOCKET_API =
    window.location.host === "localhost:3000"
        ? "ws://localhost:8080"
        : "ws://whatsup-api-production.up.railway.app";