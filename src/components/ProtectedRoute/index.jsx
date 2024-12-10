import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const currentUser = JSON.parse(localStorage.getItem("whatsupuser"));

    const isAuthenticated = currentUser && currentUser?._id ? true : false; // Replace with your actual auth check logic

    return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
