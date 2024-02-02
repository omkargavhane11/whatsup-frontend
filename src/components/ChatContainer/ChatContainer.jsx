import "./chatContainer.css";
import SendIcon from "@mui/icons-material/Send";
import Message from "../Message/Message";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { io } from "socket.io-client";
import moment from "moment";

const ChatContainer = ({
  currentChat,
  setCurrentChat,
  chatBoxOpen,
  setChatBoxOpen,
  contactList,
  setContactList,
}) => {
  const [messages, setMessages] = useState([]);

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
  }, [currentChat?._id]);

  //
  const API =
    window.location.host === "localhost:3000"
      ? "http://localhost:8080"
      : "https://whatsup-api-77.herokuapp.com";
  const SOCKET_API =
    window.location.host === "localhost:3000"
      ? "ws://localhost:8900"
      : "https://whatsup-socket.herokuapp.com";

  // logged in user data
  const currentUser = JSON.parse(localStorage.getItem("whatsupuser"));

  //
  const ChatUser = currentChat?.members.find(
    (member) => member._id !== currentUser?._id
  );

  const [inputMessage, setInputMessage] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    // socket
    const recieverId = ChatUser._id;

    socket.current?.emit("sendMessage", {
      senderId: currentUser?._id,
      recieverId,
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
        console.log(sendMessage.data.msg);
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
  const socket = useRef();
  const [socketMessage, setSocketMessage] = useState(null);
  const [socketUsers, setSocketUsers] = useState(null);

  useEffect(() => {
    socket.current?.emit("addUser", currentUser?._id);

    socket.current?.on("getUsers", (users) => {
      console.log(users);
      setSocketUsers(users);
    });
  }, [currentChat]);

  useEffect(() => {
    socket.current = io(SOCKET_API);

    socket.current?.on("getMessage", (data) => {
      setSocketMessage({
        senderId: data.senderId,
        message: data.message,
        createdAt: Date.now(),
        chatId: data.chatId,
      });
      console.log(data);
    });
  }, []);

  useEffect(() => {
    if (socketMessage) {
      currentChat._id === socketMessage.chatId &&
        setMessages([...messages, socketMessage]);
    }
  }, [socketMessage, currentChat]);

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
              <img
                alt="user"
                // src="https://sites.google.com/site/doraemon1161104319/_/rsrc/1518075394469/characters-2/nobi-nobita/Sitting-Image-Of-Nobita.png?height=200&width=188"
                src="https://p.kindpng.com/picc/s/21-211168_transparent-person-icon-png-png-download.png"
                className="cc-avatar"
              />
            </div>
            <div className="cc-top-right">
              <div className="cc-contact-name">{ChatUser?.name} </div>
              {/* <div className="cc-contact-last-seen">
                last seen today 12:32 pm
              </div> */}
            </div>
          </div>
          <div className="cc-conversation-box">
            {/* <div className="cc-conversation-box-wrapper"> */}
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
