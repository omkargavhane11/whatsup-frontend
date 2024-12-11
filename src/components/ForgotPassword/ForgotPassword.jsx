import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, useToast } from "@chakra-ui/react";
import { API } from "../../constant";

const ForgotPassword = () => {

  const navigate = useNavigate();
  const toast = useToast();

  // logged-in user
  const currentUser = JSON.parse(localStorage.getItem("whatsupuser"));
  const [loading, setLoading] = useState(false);

  const [login, setLogin] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(null);
  const [registered, setRegistered] = useState(false);

  const [number, setNumber] = useState(null);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const getOTP = async () => {
    try {

      const login = await axios.get(`${API}/user/sendOTP/${number}`);
      if (login.data.success) {
        toast({
          description: "OTP sent on " + number,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error) {
      toast({
        description: error.msg,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

    }
  }

  const handleSave = async (e) => {
    return;
    e.preventDefault();

    try {
      const payload = {
        contact: number,
        password,
      };

      if (number !== "" && password !== "") {
        setLoading(true);

        const login = await axios.post(`${API}/user/forgot-password`, payload);

        if (login.data.msg === "success") {
          navigate("/user/chats");
          localStorage.setItem("whatsupuser", JSON.stringify(login.data.user));
          emptyInputs();
        } else {
          toast({
            description: login.data.msg,
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
          emptyInputs();
        }

        setLoading(false);
      } else {
        toast({
          description: "Enter all details",
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  function emptyInputs() {
    setName("");
    setPassword("");
    setNumber("");
  }

  useEffect(() => {
    if (currentUser) {
      navigate("/user");
    }
  }, []);

  return (
    <>

      <form className="login" onSubmit={handleSave}>
        <div className="login-wrapper">
          <h2 className="login-heading">Login</h2>
          <div className="login-input-container">
            <div>Mobile Number</div>
            <div>
              <input
                value={number}
                onChange={(e) => setNumber(Number(e.target.value))}
                type="number"
                className="login-input"
              />
            </div>
            <div>
              <div>OTP</div>
              <input
                onChange={(e) => setOtp(Number(e.target.value))}
                type="number"
                placeholder="ex- 5486"
                className="login-input"
                minLength="4"
                maxLength="4"
                value={otp}
              />
            </div>
            <div>New Password</div>
            <div>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                name=""
                id=""
                className="login-input"
              />
            </div>
            <button
              disabled={loading}
              type="submit"
              className="login-send-otp-button"
            >
              {loading ? (
                <CircularProgress color="inherit" className="login-loader" />
              ) : (
                "Save"
              )}
            </button>
          </div>
          <div className="login-bottom-link" onClick={() => navigate("/")}>

            <span className="login-signup-link">
              Login
            </span>
          </div>
        </div>
      </form>

    </>
  );
};

export default ForgotPassword;
