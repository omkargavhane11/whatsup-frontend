import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, useToast } from "@chakra-ui/react";

const Register = () => {
    const API =
        window.location.host === "localhost:3000"
            ? "http://localhost:8080"
            : "https://whatsup-api-production.up.railway.app";
    const SOCKET_API =
        window.location.host === "localhost:3000"
            ? "http://localhost:8900"
            : // : "https://whatsup-socket-production.up.railway.app";
            "https://whatsup-api-production.up.railway.app";

    const navigate = useNavigate();
    const toast = useToast();

    // logged-in user
    const currentUser = JSON.parse(localStorage.getItem("whatsupuser"));
    const [loading, setLoading] = useState(false);

    const [otpSent, setOtpSent] = useState(false);

    const [registered, setRegistered] = useState(false);

    const [number, setNumber] = useState("");
    const [otp, setOtp] = useState(null);
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const getOTP = async () => {
        try {
            const login = await axios.get(`${API}/user/sendOTP/${number}`);
            if (!login.data.error) {
                toast({
                    description: "OTP sent on " + number,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top",
                });
                setOtpSent(true)
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

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name,
                password,
                contact: number,
                otp: otp
            };

            if (name !== "" || password !== "" || otp?.length !== 4 || number !== 10) {
                setLoading(true);
                const signup = await axios.post(`${API}/user/register`, payload);

                if (!signup.data.error) {
                    setRegistered(true);
                    setOtpSent(true)
                    toast({
                        description: "Registered Successfully",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                        position: "top",
                    });
                    navigate("/")

                } else {
                    toast({
                        description: signup.data.msg,
                        status: "warning",
                        duration: 3000,
                        isClosable: true,
                        position: "top",
                    });
                }
            } else {
                toast({
                    description: "Please enter all details",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                    position: "top",
                });
            }

            setLoading(false);
            emptyInputs();
        } catch (error) {
            console.log(error.message);
            toast({
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
            emptyInputs();
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
            <form className="login" onSubmit={handleSignup}>
                <div className="login-wrapper">
                    <h2 className="login-heading">Sign Up</h2>
                    <div className="login-input-container">
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

                            <div>
                                <div>Mobile number</div>
                                <input
                                    onChange={(e) => setNumber(Number(e.target.value))}
                                    type="number"
                                    className="login-input"
                                    value={number}
                                />
                            </div>
                            {number.toString().length === 10 && <div
                                className=""
                                style={{ textAlign: "right", cursor: "pointer" }}
                                onClick={getOTP}
                            >
                                Get OTP
                            </div>}
                            {otpSent && <div>
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
                            </div>}

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
                            {/* {otpSent && <div> */}
                            <button
                                type="submit"
                                disabled={loading || !otpSent}
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
                            {/* </div>} */}
                            <div>
                                <div
                                    className="login-signup-link"
                                    onClick={() => navigate("/")}
                                >
                                    Login
                                </div>
                            </div>
                        </>
                    </div>
                </div>
            </form>
        </>
    );
};

export default Register;
