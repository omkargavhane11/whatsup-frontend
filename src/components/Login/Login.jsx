import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, useToast } from "@chakra-ui/react";

const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);

  const [login, setLogin] = useState(true);
  const [optSent, setOtpSent] = useState(false);

  const [registered, setRegistered] = useState(false);

  const [number, setNumber] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        email,
        password,
      };

      if (email !== "" && password !== "") {
        setLoading(true);

        const login = await axios.post(
          "https://whatsup-api-77.herokuapp.com/user/login",
          payload
        );

        if (login.data.msg === "success") {
          navigate("/user");
          localStorage.setItem("whatsupuser", JSON.stringify(login.data.user));
          setEmail("");
          setName("");
          setPassword("");
        } else {
          toast({
            // title: "Error",
            // description: login.data.msg,
            // status: "error",
            render: () => (
              <Box color="white" p={3} bg="teal" borderRadius={"2px"}>
                {login.data.msg}
              </Box>
            ),
            duration: 3000,
            isClosable: true,
            position: "top",
          });
          setEmail("");
          setName("");
          setPassword("");
        }

        setLoading(false);
      } else {
        toast({
          // title: "Error",
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

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name,
        email,
        password,
        contact: number,
      };

      if (name !== "" && email !== "" && password !== "") {
        setLoading(true);
        const signup = await axios.post(
          "https://whatsup-api-77.herokuapp.com/user/register",
          payload
        );

        if (signup.data.msg === "registration successfull") {
          // navigate("/user/46546213");
          setRegistered(true);
          toast({
            // title: "Error",
            description: "Registered Successfully",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
        } else if (
          signup.data.msg === "User already registered with the same email"
        ) {
          toast({
            // title: "Error",
            description: signup.data.msg,
            status: "warning",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
        }
      } else {
        toast({
          // title: "Error",
          description: "Please enter all details",
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }

      setLoading(false);
      setEmail("");
      setName("");
      setPassword("");
      setNumber("");
    } catch (error) {
      console.log(error.message);
      toast({
        // title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setEmail("");
      setName("");
      setPassword("");
      setNumber("");
      setLoading(false);
    }
  };

  return (
    <>
      {login ? (
        <form className="login" onSubmit={handleLogin}>
          <div className="login-wrapper">
            <h2 className="login-heading">Login</h2>
            <div className="login-input-container">
              <div>Email</div>
              <div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="login-input"
                />
              </div>
              <div>Password</div>
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
                  "Login"
                )}
              </button>
            </div>
            <div className="login-bottom-link" onClick={() => setLogin(false)}>
              New User ? <span className="login-signup-link">Sign up</span>
            </div>
          </div>
        </form>
      ) : (
        <form className="login" onSubmit={handleSignup}>
          <div className="login-wrapper">
            <h2 className="login-heading">Sign Up</h2>
            {!registered && (
              <div className="login-input-container">
                {optSent && (
                  <>
                    <div className="login-input-label">
                      Enter 4 digit OTP sent to your entered mobile number
                    </div>
                    <input
                      type="number"
                      placeholder="ex- 5486"
                      className="login-input"
                      minLength="4"
                      maxLength="4"
                    />
                    <div>
                      <button
                        className="login-send-otp-button"
                        onClick={() => setRegistered(true)}
                      >
                        Confirm
                      </button>
                    </div>
                  </>
                )}
                {!optSent && (
                  <>
                    <div>Name</div>
                    <div>
                      <input
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        value={name}
                        className="login-input"
                      />
                    </div>
                    <div>Email</div>
                    <div>
                      <input
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        value={email}
                        className="login-input"
                      />
                    </div>
                    <div>
                      <div>Mobile number</div>
                      <input
                        onChange={(e) => setNumber(e.target.value)}
                        type="number"
                        value={number}
                        className="login-input"
                      />
                    </div>
                    <div>Password</div>
                    <div>
                      <input
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        name=""
                        id=""
                        value={password}
                        className="login-input"
                      />
                    </div>
                    <div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="login-send-otp-button"
                      >
                        {loading ? (
                          <CircularProgress
                            color="inherit"
                            className="login-loader"
                          />
                        ) : (
                          "Sign Up"
                        )}
                      </button>
                    </div>
                    <div>
                      <div
                        className="login-signup-link"
                        onClick={() => setLogin(true)}
                      >
                        Login
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            {registered && (
              <div className="login-registration-success">
                <h2>Registered Succcessfully</h2>
                <button onClick={() => setLogin(true)}>Login ➡</button>
              </div>
            )}
          </div>
        </form>
      )}
    </>
  );
};

export default Login;
