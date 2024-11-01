import "./chatContainer.css";
import SendIcon from "@mui/icons-material/Send";
import Message from "../Message/Message";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { io } from "socket.io-client";
import moment from "moment";
import PERSON_IMAGE from "../../assets/person_image.jpg";
import socket from "../../config/socket.config";
import { v4 as uuidv4 } from "uuid";

const ChatContainer = ({
  currentChat,
  setCurrentChat,
  chatBoxOpen,
  setChatBoxOpen,
  contactList,
  setContactList,
}) => {
  const [messages, setMessages] = useState([]);

  //
  const API =
    window.location.host === "localhost:3000"
      ? "http://localhost:8080"
      : "https://whatsup-api-production.up.railway.app";
  const SOCKET_API =
    window.location.host === "localhost:3000"
      ? "ws://localhost:8080"
      : // : "https://whatsup-socket-production.up.railway.app";
        "https://whatsup-api-production.up.railway.app";

  // logged in user data
  const currentUser = JSON.parse(localStorage.getItem("whatsupuser"));

  //
  const ChatUser = currentChat?.members?.find(
    (member) => member._id !== currentUser?._id
  );

  const [inputMessage, setInputMessage] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    // socket
    const receiverId = ChatUser?._id;

    socket?.emit("sendMessage", {
      senderId: currentUser?._id,
      receiverId,
      message: inputMessage,
      chatId: currentChat._id,
    });

    console.log("message sent as :: ", {
      senderId: currentUser?._id,
      receiverId,
      message: inputMessage,
      chatId: currentChat._id,
    });

    //

    if (inputMessage.length !== 0) {
      const payload = {
        senderId: currentUser?._id,
        message: inputMessage,
        chatId: currentChat._id,
      };

      setMessages([
        ...messages,
        { ...payload, _id: Math.random().toString(), createdAt: Date.now() },
      ]);
      try {
        const sendMessage = await axios.post(
          `${API}/message/new-message`,
          payload
        );
        // console.log(sendMessage.data.msg);
      } catch (error) {
        console.log(error.message);
      }
    } else {
      alert("Please type something to send message !");
    }

    setInputMessage("");
  };

  const scrollRef = useRef();
  useEffect(() => {
    scrollRef.current?.scrollIntoView();
  }, [messages]);

  //✅ socket

  // const [socket, setSocket] = useState(null);
  // const socket = useRef();
  const [socketMessage, setSocketMessage] = useState({});
  const [socketUsers, setSocketUsers] = useState([]);

  useEffect(() => {
    // socket = io(SOCKET_API);

    socket?.emit("addUser", currentUser?._id);

    socket?.on("getMessage", (data) => {
      let socketMessage = {
        senderId: data.senderId,
        message: data.message,
        createdAt: Date.now(),
        chatId: data.chatId,
        _id: uuidv4(),
      };
      setSocketMessage(socketMessage);

      console.log("getMessage :: ", data);
      currentChat._id === socketMessage.chatId &&
        setMessages([...messages, socketMessage]);
    });

    return () => {
      socket?.disconnect();
    };
  }, []);

  useEffect(() => {
    socket?.on("getUsers", (users) => {
      console.log(users);
      setSocketUsers(users);
    });

    // return () => {
    //   socket?.disconnect();
    // };
  }, [currentChat]);

  // useEffect(() => {
  //   if (socketMessage) {
  //     currentChat._id === socketMessage.chatId &&
  //       setMessages([...messages, socketMessage]);
  //   }

  //   // return () => {
  //   //   socket?.disconnect();
  //   // };
  // }, [socketMessage, currentChat]);

  // fetch chats of user
  useEffect(() => {
    async function getMsgs() {
      try {
        const getMessages = await axios.get(
          `${API}/message/get-chat-message/${currentChat._id}`
        );
        setMessages(getMessages.data);
      } catch (error) {
        console.log(error.message);
      }
    }
    if (currentChat) {
      getMsgs();
    }

    // return () => {
    //   socket?.disconnect();
    // };
  }, [currentChat?._id]);

  return (
    <>
      {currentChat && (
        <div className="cc">
          <div className="cc-top">
            <div
              className="cc-back-icon"
              onClick={() => {
                setChatBoxOpen(false);
                setCurrentChat(null);
              }}
            >
              <ArrowBackIcon />
            </div>
            <div className="cc-top-left">
              <img alt="user" src={PERSON_IMAGE} className="cc-avatar" />
            </div>
            <div className="cc-top-right">
              <div className="cc-contact-name">{ChatUser?.name} </div>
              <div className="font-14">
                {socketUsers?.find((u) => u.userId === ChatUser._id)
                  ? "online"
                  : moment(Date.now()).format("LL")}
              </div>
            </div>
          </div>
          <div className="cc-conversation-box">
            {messages?.map((msg, index, array) => {
              let showDateBadge =
                index === 0
                  ? true
                  : new Date(array[index - 1]?.createdAt)
                      .toLocaleDateString()
                      .split("/")[0] ===
                    new Date(msg?.createdAt).toLocaleDateString().split("/")[0]
                  ? false
                  : true;

              let currentDate = new Date();
              let yesterdayDate = new Date();
              yesterdayDate.setDate(yesterdayDate - 1);
              let messageDate = new Date(msg?.createdAt);

              let isToday =
                currentDate.toLocaleDateString().toString() ===
                messageDate.toLocaleDateString().toString();

              let isYesterday =
                yesterdayDate.toLocaleDateString().toString() ===
                messageDate.toLocaleDateString().toString();

              return (
                <div
                  className="cc-conversation-box-wrapper"
                  ref={scrollRef}
                  key={msg?._id}
                >
                  {showDateBadge ? (
                    <div
                      style={{
                        fontSize: "12px",
                        padding: "3px 6px",
                        borderRadius: "4px",
                        textAlign: "center",
                        alignSelf: "center",
                        backgroundColor: "white",
                        color: "grey",
                      }}
                    >
                      {isToday
                        ? "Today"
                        : isYesterday
                        ? "Yesterday"
                        : moment(msg?.createdAt).format("L")}
                    </div>
                  ) : null}
                  <Message
                    key={msg?._id}
                    msg={msg}
                    currentUser={msg?.senderId === currentUser?._id}
                    // ref={scrollRef}
                  />
                </div>
              );
            })}
            {/* </div> */}
          </div>
          <div className="cc-bottom">
            {/* <img
              src="https://cdn0.iconfinder.com/data/icons/emoji/100/Emoji_Smile2-512.png"
              className="cc-bottom-emojis"
            ></img> */}
            {/* <div className="cc-bottom-file-attachment-container">
              <img
                src="https://cdn-icons-png.flaticon.com/512/237/237510.png"
                alt=""
                className="cc-file-attachment-icon"
              />
              <input type="file" className="cc-bottom-file-attachment" />
            </div> */}
            <form action="" onSubmit={sendMessage} style={{ width: "100%" }}>
              <input
                type="text"
                placeholder="Type a message..."
                className="cc-message-box"
                onChange={(e) => setInputMessage(e.target.value)}
                value={inputMessage}
                id="send-message"
                onKeyUp={(e) => {
                  if (e.target.code === 13) {
                    sendMessage();
                    console.log("enter pressed");
                  }
                }}
              />
            </form>
            <div
              className="cc-bottom-send-message-button"
              onClick={sendMessage}
            >
              <SendIcon />
            </div>
          </div>
        </div>
      )}
      {!currentChat && (
        <p className="cc-emp">Select chat to have conversation</p>
      )}
    </>
  );
};

export default ChatContainer;
