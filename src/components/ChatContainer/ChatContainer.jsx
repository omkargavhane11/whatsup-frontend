import "./chatContainer.css";
import SendIcon from "@mui/icons-material/Send";
import Message from "../Message/Message";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ChatContainer = ({
  currentChat,
  setCurrentChat,
  messages,
  setMessages,
  socket,
  chatBoxOpen,
  setChatBoxOpen,
}) => {
  const currentUser = JSON.parse(localStorage.getItem("whatsupuser"));

  const ChatUser = currentChat?.members.find(
    (member) => member._id !== currentUser._id
  );

  const [inputMessage, setInputMessage] = useState("");

  const sendMessage = async () => {
    // socket
    const recieverId = ChatUser._id;

    socket.current.emit("sendMessage", {
      senderId: currentUser._id,
      recieverId,
      message: inputMessage,
    });

    //
    const payload = {
      senderId: currentUser._id,
      message: inputMessage,
      chatId: currentChat._id,
    };

    if (inputMessage.length !== 0) {
      try {
        const sendMessage = await axios.post(
          "https://whatsup-api-77.herokuapp.com/message/new-message",
          payload
        );
        if (sendMessage.data.msg === "message sent") {
          setMessages([
            ...messages,
            { ...payload, _id: Math.random().toString() },
          ]);
          setCurrentChat({ ...currentChat, lastMessage: inputMessage });
        }
        console.log(sendMessage.data.msg);
      } catch (error) {
        console.log(error.message);
      }
      setInputMessage("");
    } else {
      alert("Please type something to send message !");
    }
  };

  const scrollRef = useRef();
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
                src="https://sites.google.com/site/doraemon1161104319/_/rsrc/1518075394469/characters-2/nobi-nobita/Sitting-Image-Of-Nobita.png?height=200&width=188"
                alt="user-image"
                className="cc-avatar"
              />
            </div>
            <div className="cc-top-right">
              <div className="cc-contact-name">{ChatUser?.contact}</div>
              {/* <div className="cc-contact-last-seen">
                last seen today 12:32 pm
              </div> */}
            </div>
          </div>
          <div className="cc-conversation-box">
            <div className="cc-conversation-box-wrapper">
              {messages?.map((msg) => (
                <Message
                  ref={scrollRef}
                  key={msg?._id}
                  msg={msg}
                  currentUser={msg?.senderId === currentUser._id}
                />
              ))}
            </div>
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
            <input
              type="text"
              placeholder="Type a message..."
              className="cc-message-box"
              onChange={(e) => setInputMessage(e.target.value)}
              value={inputMessage}
            />
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
        <h3 className="cc-emp">Select chat to have conversation</h3>
      )}
    </>
  );
};

export default ChatContainer;
