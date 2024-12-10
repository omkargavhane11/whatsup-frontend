import "./chats.css";
// components
import Chat from "../Chat/Chat.jsx";
import ContactList from "../ContactList/ContactList.jsx";
import ChatContainer from "../ChatContainer/ChatContainer.jsx";
// icons
import SearchIcon from "@mui/icons-material/Search";
//
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import socket from "../../config/socket.config.js";
import { Close } from "@mui/icons-material";
import { Button } from "@chakra-ui/react";
import { API } from "../../constant.js";
import { v4 as uuidv4 } from "uuid";


const Chats = () => {
  const params = useParams();
  const navigate = useNavigate();
  const chatId = params.chatId ?? null;
  const [tab, setTab] = useState(1);
  const chatBoxOpen = params.chatId ? true : false;

  // logged-in user
  const currentUser = JSON.parse(localStorage.getItem("whatsupuser"));

  const [contact, setContact] = useState(false);
  const [contactList, setContactList] = useState([]);
  const [currentChat, setCurrentChat] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [searchValue, setSearchValue] = useState("")

  const handleLogout = () => {
    localStorage.removeItem("whatsupuser");
    navigate("/");
  };

  const getChats = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/chat/get-chat/${currentUser?._id}`);
      if (!res.error) {
        setContactList(res.data.chats);
      }
    } catch (error) {
    }
  }, []);

  const getPersonByNumber = useCallback(async (value) => {
    try {
      const res = await axios.get(`${API}/user/find-user/${value}`);
      setSearchResults(res.data.data);
    } catch (error) {
    }
  }, []);



  useEffect(() => {
    if (tab === 1) {
      getChats();
    }

    if (!socket.connected) {
      socket.connect();
    }

    socket?.on("getMessage", (data) => {
      console.log("getMessage APP  :: ", data)
      let socketMessage = {
        senderId: data?.senderId,
        message: data?.message,
        createdAt: Date.now(),
        chatId: data?.chatId,
        _id: uuidv4(),
      };

      setContactList((prev) => {
        let temp = prev.map((c) => {
          if (c?._id === socketMessage?.chatId) {
            return { ...c, lastMessage: socketMessage }
          }
          return c;
        })
        return temp;
      })
    });

    // code to update last msg sent or recieved in chat
    socket.on("update-last-read-msg", (data) => {
      console.log("ulrm recieved :: ", data)
      setContactList((prev) => {
        console.log("prevChats :: ", prev)
        let temp = prev.map((item) => {
          if (item._id == data.chatId) {
            return { ...item, lastMessage: { ...item.lastMessage, isRead: false } }
          }
        })
        return temp;
      })
    })

    // get unread msg count
    socket?.on("consume-show-not-read-count", (data) => {
      console.log("consume-show-not-read-count", data)
      if (chatId !== data.chatId) {
        setContactList((prev) => {
          let temp = prev.map((item) => {
            console.log("item :: ", item)
            if (item._id === data.chatId) {
              return { ...item, unreadMsgCount: data.unreadMsgCount }
            }
            return item;
          })
          return temp;
        })
      }
    })

    return (() => {

      // alert("you are leaving !")
      socket.off("update-last-read-msg");
      socket.off("getMessage");
      socket.off("consume-show-not-read-count")

      if (currentUser?._id) {
        socket.emit("leave", currentUser._id, currentUser.name);
      }

      // Disconnect the socket
      socket.disconnect();
    })

  }, [tab, chatId]);


  return (
    <div>
      <div className="app-wrapper">
        <div className={chatBoxOpen ? "app-left app-chatbox" : "app-left"}>
          <div className={contact ? "cl-component-open" : "cl-component-close"}>
            {/* <ContactList
              contactList={contactList}
              setContactList={setContactList}
            /> */}
          </div>
          <div className="app-left-topbar">
            <div className="app-topbar-left">
            </div>
            <div className="tab chat_tab" onClick={() => setTab(1)}>
              Chats
            </div>
            <div className="tab contacts_tab" onClick={() => setTab(2)}>
              Contacts
            </div>
            <div className="tab profile_tab" onClick={() => setTab(3)}>
              Profile
            </div>
            <div className="app-topbar-right">
            </div>
          </div>
          {tab === 1 ? (
            <>
              {" "}

              <div className="app-left-chatbox">
                <div className="app-left-chatbox-wrapper">

                  {contactList?.length > 0 && contactList?.map((item) => {

                    return (
                      <Chat
                        key={item._id}
                        item={item}
                        setCurrentChat={setCurrentChat}
                      />
                    )
                  })}

                  {contactList?.length === 0 && (
                    <h3 className="app-emp">No Chats !</h3>
                  )}

                </div>
              </div>{" "}
            </>
          ) : tab === 2 ? (
            <>
              <div className="app-left-searchbox">
                <div className="app-left-searchbox-wrapper">
                  <input
                    type="text"
                    placeholder="Search number..."
                    className="app-searchbox-input"
                    value={searchValue}
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                      if (e.target.value?.length === 10) {
                        getPersonByNumber(e.target.value);
                      }
                    }}
                  />
                  {searchValue?.length !== 0 && <Close onClick={() => {
                    setSearchValue("");
                    setSearchResults([]);

                  }} />}
                  <SearchIcon />
                </div>
                {searchResults?.length > 0 && searchResults?.map((item) => (
                  <Chat
                    key={item._id}
                    item={item}
                    setCurrentChat={setCurrentChat}
                    chatBoxOpen={chatBoxOpen}
                    search={true}
                    setTab={setTab}
                  />
                ))}
              </div>
            </>
          ) : (
            <div
              className="app-left"
              style={{
                width: "100%",
                textAlign: "center",
                padding: "30px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                height: "80%",
                justifyContent: "space-between"
              }}
            >
              {/* {currentUser?._id} */}
              {currentUser?.name}
              <Button onClick={handleLogout}>Logout</Button>
            </div>
          )}
        </div>

        <div className={!chatBoxOpen ? "app-right" : "app-right app-chatbox"}>
          {chatId !== null ? <ChatContainer
            currentChat={currentChat}
            setCurrentChat={setCurrentChat}
            chatBoxOpen={chatBoxOpen}
            contactList={contactList}
            setContactList={setContactList}
          /> :
            <p className="cc-emp">Select chat to have conversation</p>
          }
        </div>
      </div>
    </div >
  );
};

export default Chats;
