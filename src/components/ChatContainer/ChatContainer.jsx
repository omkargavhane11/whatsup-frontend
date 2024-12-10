import "./chatContainer.css";
import SendIcon from "@mui/icons-material/Send";
import Message from "../Message/Message";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import moment from "moment";
import PERSON_IMAGE from "../../assets/person_image.jpg";
import socket from "../../config/socket.config";
import { v4 as uuidv4 } from "uuid";
import { API } from "../../constant";
import { useNavigate, useParams } from "react-router-dom";

const ChatContainer = ({ setChatList, setFilteredChatList }) => {
  const params = useParams();
  const chatId = params.chatId ?? null;
  const [currentChat, setCurrentChat] = useState({});


  const getChatDetails = async () => {
    try {
      const { data } = await axios.get(`${API}/chat/get-chat-by-id/` + chatId);
      if (data.data) {
        console.log("response : ", data.data);
        setCurrentChat(data.data)
      }
    } catch (error) {
      setCurrentChat({})
    }
  }

  useEffect(() => {
    getChatDetails();
    return () => {
    }
  }, []);

  if (currentChat?._id) {
    return <ChatContainerChild currentChat={currentChat} setCurrentChat={setCurrentChat} setChatList={setChatList} setFilteredChatList={setFilteredChatList} />
  }

  return null;
}

const ChatContainerChild = ({ currentChat, setChatList, setFilteredChatList }) => {
  const params = useParams();
  const chatId = params.chatId ?? null;
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
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
    const receiverId = ChatUser?._id || "";

    socket?.emit("sendMessage", {
      senderId: currentUser?._id,
      receiverId,
      message: inputMessage,
      chatId: currentChat?._id,
      socketId: socket.id,
      isRead: false
    });

    if (inputMessage.length !== 0) {
      const payload = {
        senderId: currentUser?._id,
        message: inputMessage,
        chatId: currentChat?._id,
        recieverId: ChatUser?._id
      };

      let msgPayload = { ...payload, _id: Math.random().toString(), createdAt: Date.now(), isRead: false };

      let newMsgArr = [
        ...messages, msgPayload
      ];
      setMessages(newMsgArr);

      // get unread messages
      let [msgIds, unreadMsgCount] = getUnreadMsgIds(newMsgArr);
      socket?.emit("show-not-read-count", { unreadMsgCount, receiverId: ChatUser?._id, chatId })

      setChatList((chats) => {
        let temp = chats.map((c) => {
          if (c._id === chatId) {
            return { ...c, lastMessage: msgPayload }
          }
          else {
            return c;
          }
        })
        setFilteredChatList([...temp]);
        return temp;
      })

      try {
        const sendMessage = await axios.post(
          `${API}/message/new-message`,
          {...payload, unreadCount: unreadMsgCount}
        );
      } catch (error) {
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
  const [socketUsers, setSocketUsers] = useState([]);

  const getMsgs = async () => {
    try {
      const getMessages = await axios.post(
        `${API}/message/get-chat-message/${chatId}`, { userId: currentUser?._id, friendId: ChatUser?._id }
      );


      if (getMessages?.data?.data && getMessages?.data?.data?.length > 0) {
        setMessages(getMessages.data.data);

        // get unread messages
        let [msgIds, unreadMsgCount] = getUnreadMsgIds(getMessages.data.data);
        console.log("msgIds :: ", msgIds, unreadMsgCount)
        // send to socket for it to be read by in reciver chat 
        socket?.emit("read-unread-msgs", { messageIds: msgIds, receiverId: ChatUser?._id, chatId })
        socket?.emit("show-not-read-count", { unreadMsgCount, receiverId: ChatUser?._id, chatId })
        handleReadUnreadMsgs();
      }
    } catch (error) {
      // console.log(error.message);
    }
  }
  const handleReadUnreadMsgs = async () => {
    try {
      await axios.post(
        `${API}/message/read-unread-chat-message/${chatId}`, { userId: currentUser?._id, friendId: ChatUser?._id }
      );

    } catch (error) {
      // console.log(error.message);
    }
  }

  const getUnreadMsgIds = (msgs) => {
    // console.log("msgs rr :: ", msgs)
    let ids = [];
    let count = 0;
    try {
      for (let i = msgs.length - 1; i >= 0; i--) {
        console.log("msg item :: ", msgs[i])
        if (!msgs[i]?.isRead && msgs[i]?.senderId !== currentUser?._id) {
          ids.push(msgs[i]?._id);
        } else if (!msgs[i]?.isRead && msgs[i]?.senderId === currentUser?._id) {
          count++;
        } else if (msgs[i]?.isRead) {
          break;
        }
      }
      return [ids, count];
    } catch (error) {
      return [];
    }
  }

  // fetch chats of user
  useEffect(() => {

    if (currentChat !== null) {
      getMsgs();
    }
  }, [currentChat?._id]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    // 
    socket?.on("getMessage", (data) => {
      console.log("getMessage :: ", data)
      let socketMessage = {
        senderId: data.senderId,
        message: data.message,
        createdAt: Date.now(),
        chatId: data.chatId,
        isRead: data.isRead,
        _id: uuidv4(),
      };
      // console.log(socketMessage?.chatId + " type :: ", typeof (socketMessage?.chatId))
      // console.log(currentChat?._id + " type :: ", typeof (currentChat?._id))
      // console.log(currentChat?._id === socketMessage?.chatId)
      if (
        chatId === socketMessage?.chatId
      ) {
        setMessages((prevMsgs) => ([...prevMsgs, socketMessage]));
        console.log("chatId :: ", chatId)
        // send to socket for it to be read by in reciver chat 
        socket?.emit("read-unread-msgs", { messageIds: [socketMessage?._id], receiverId: data.senderId, chatId })
      }
    });

    // consume unread msgs to make it read
    socket.on("consume-read-unread-msgs", (data) => {
      console.log("rum consume client :: ", data)
      setMessages((prevItems) => {
        // Create a shallow copy of the array
        const updatedItems = [...prevItems];

        // Update the last `count` items
        for (let i = updatedItems.length - 1; i >= updatedItems.length - data.messageIds.length; i--) {
          updatedItems[i] = { ...updatedItems[i], isRead: true }; // Example update logic
        }

        return updatedItems; // Return the modified array
      });

      setChatList((chats) => {
        let temp = chats.map((c) => {
          if (c._id === chatId) {
            return { ...c, lastMessage: { ...c?.lastMessage, isRead: true } }
          }
          else {
            return c;
          }
        })

        setFilteredChatList(temp);
        return temp;
      })

    })

    // ask for online status 
    socket.emit("subscribe-online-status", { requesterId: currentUser?._id, targetUserId: ChatUser?._id })

    // get online status
    socket.on("consume-subscribe-online-status", (data) => {
      console.log("consume-subscribe-online-status", data);
      setIsOnline(data.isOnline);
    })

    return (() => {
      socket.off("getMessage");
      socket.off("consume-read-unread-msgs");
      socket.off("consume-subscribe-online-status");
      socket.emit("unsubscribe-online-status", { requesterId: currentUser?._id, targetUserId: ChatUser?._id })
      console.log("unmounted")
    })

  }, []);

  // useEffect(() => {
  //   let unreadMsgCount = messages.filter((msg) => msg.isRead !== true)?.length;
  //   console.log("unreadMsgCount :: ", unreadMsgCount)
  // }, [messages?.length]);





  return (
    <>
      {currentChat?._id && (
        <div className="cc">
          <div className="cc-top">
            <div
              className="cc-back-icon"
              onClick={() => {
                navigate("/user/chats");
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
                {isOnline
                  ? "online"
                  : moment(ChatUser?.lastSeen).calendar()}
              </div>
            </div>
          </div>
          <div className="cc-conversation-box">
            {messages?.length > 0 && messages?.map((msg, index, array) => {
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
                    // console.log("enter pressed");
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
