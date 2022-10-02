import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();

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
        const login = await axios.post(
          "http://localhost:8080/user/login",
          payload
        );

        if (login.data.msg === "success") {
          navigate("/user");
          localStorage.setItem("whatsupuser", JSON.stringify(login.data.user));
          setEmail("");
          setName("");
          setPassword("");
        } else {
          alert(login.data.msg);
          setEmail("");
          setName("");
          setPassword("");
        }
      } else {
        alert("Enter all details");
      }
    } catch (error) {
      console.log(error.message);
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
        const signup = await axios.post(
          "http://localhost:8080/user/register",
          payload
        );

        if (signup.data.msg === "registration successfull") {
          // navigate("/user/46546213");
          setRegistered(true);
        } else if (
          signup.data.msg === "User already registered with the same email"
        ) {
          alert(signup.data.msg);
        }
      } else {
        alert("Please enter all details");
      }

      setEmail("");
      setName("");
      setPassword("");
      setNumber("");
    } catch (error) {
      console.log(error.message);
      setEmail("");
      setName("");
      setPassword("");
      setNumber("");
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
              <button type="submit" className="login-send-otp-button">
                Login
              </button>
            </div>
            <div className="" onClick={() => setLogin(false)}>
              New User ? <span className="login-signup-link">Sign up</span>
            </div>
          </div>
        </form>
      ) : (
        <form className="login" onSubmit={handleSignup}>
          <div className="login-wrapper">
            <h2 className="login-heading">Signup with mobile number</h2>
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
                      <button type="submit" className="login-send-otp-button">
                        Sign Up
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
              <>
                <h3>Registered Succcessfully</h3>
                <button onClick={() => setLogin(true)}>Login ➡</button>
              </>
            )}
          </div>
        </form>
      )}
    </>
  );
};

export default Login;
