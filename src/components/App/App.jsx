import "./app.css";
// components
import Chat from "../Chat/Chat";
import ContactList from "../ContactList/ContactList";
import ChatContainer from "../ChatContainer/ChatContainer";
import ChatSkeleton from "../ChatSkeleton/ChatSkeleton";
import HomeModal from "../modals/HomeModal/HomeModal.jsx";
// icons
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LogoutIcon from "@mui/icons-material/Logout";
//
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { chat_skeleton } from "../../skeleton.js";
import socket from "../../config/socket.config.js";

export const App = () => {
  //
  const API =
    window.location.host === "localhost:3000"
      ? "http://localhost:8080"
      : "https://whatsup-api-production.up.railway.app";
  const SOCKET_API =
    window.location.host === "localhost:3000"
      ? "http://localhost:8080"
      : // : "https://whatsup-socket-production.up.railway.app";
        "https://whatsup-api-production.up.railway.app";

  const navigate = useNavigate();

  const [tab, setTab] = useState(1);
  const [chatBoxOpen, setChatBoxOpen] = useState(false);

  const [arr, setArr] = useState([1, 2, 3, 4]);

  useEffect(() => {
    // if(arr.length === 0){
    console.log("arr changed");
    // }else{
    //   co
    // }
  }, [arr]);

  // logged-in user
  const currentUser = JSON.parse(localStorage.getItem("whatsupuser"));

  const [contact, setContact] = useState(false);
  const [contactList, setContactList] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);

  const handleLogout = () => {
    navigate("/");
    localStorage.removeItem("whatsupuser");
  };

  const getChats = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/chat/get-chat/${currentUser?._id}`);
      setContactList(res.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getChats();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, []);

  return (
    <div>
      <button
      style={{
        height:"40px",
        width:"200px",
        border: "1px solid black",
        padding:"10px"
      }}
        onClick={() => {
          let temp  = [...arr, Math.random() * (1 - 100) + 100];
          setArr(temp);
          console.log("button pressed");
        }}
      >
        click me
      </button>
      <div className="app-wrapper">
        <div className={chatBoxOpen ? "app-left app-chatbox" : "app-left"}>
          <div className={contact ? "cl-component-open" : "cl-component-close"}>
            <ContactList
              contact={contact}
              setContact={setContact}
              contactList={contactList}
              setContactList={setContactList}
            />
          </div>
          <div className="app-left-topbar">
            <div className="app-topbar-left">
              {/* <img
                src="https://p.kindpng.com/picc/s/21-211168_transparent-person-icon-png-png-download.png"
                alt="user-image"
                className="app-avatar"
              /> */}
              {/* Hello, {currentUser?.name} ! */}
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
              {/* <PersonAddIcon
                className="app-person-add-icon"
                onClick={() => setContact(true)}
              />
              <LogoutIcon
                className="app-more-vert-icon"
                onClick={handleLogout}
              /> */}
              {/* <HomeModal className="app-home-modal-component" handleLogout={handleLogout}/> */}
            </div>
          </div>
          {tab === 1 ? (
            <>
              {" "}
              <div className="app-left-searchbox">
                <div className="app-left-searchbox-wrapper">
                  <SearchIcon />
                  <input
                    type="text"
                    placeholder="Search chat..."
                    className="app-searchbox-input"
                  />
                </div>
              </div>
              <div className="app-left-chatbox">
                <div className="app-left-chatbox-wrapper">
                  <>
                    {contactList === null &&
                      chat_skeleton.map((item) => <ChatSkeleton />)}
                    {contactList?.length > 0 && (
                      <>
                        {contactList?.map((item) => (
                          <Chat
                            key={item._id}
                            item={item}
                            setCurrentChat={setCurrentChat}
                            chatBoxOpen={chatBoxOpen}
                            setChatBoxOpen={setChatBoxOpen}
                          />
                        ))}
                      </>
                    )}
                    {!contactList?.length && contactList !== null && (
                      <h3 className="app-emp">No Chats !</h3>
                    )}
                  </>
                </div>
              </div>{" "}
            </>
          ) : tab === 2 ? (
            <div className="app-left">Contacts</div>
          ) : (
            <div
              className="app-left"
              style={{
                width: "100%",
                textAlign: "center",
                padding: "30px",
                boxSizing: "border-box",
              }}
            >
              {/* {currentUser?._id} */}
              {currentUser?.name}
            </div>
          )}
        </div>
        <div className={!chatBoxOpen ? "app-right" : "app-right app-chatbox"}>
          <ChatContainer
            currentChat={currentChat}
            setCurrentChat={setCurrentChat}
            chatBoxOpen={chatBoxOpen}
            setChatBoxOpen={setChatBoxOpen}
          />
        </div>
      </div>
    </div>
  );
};
