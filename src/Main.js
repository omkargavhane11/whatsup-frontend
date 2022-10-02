import "./main.css";
import { App } from "./components/App/App";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";

function Main() {
  return (
    <div className="Main">
      <Routes>
        <Route path="/user" element={<App />} />
        <Route path="/" element={<Login />} />
      </Routes>

    </div>
  );
}

export default Main;
