import "./app.css";
// components
import Chat from "../Chat/Chat";
import ContactList from "../ContactList/ContactList";
import ChatContainer from "../ChatContainer/ChatContainer";
import ChatSkeleton from "../ChatSkeleton/ChatSkeleton";
// icons
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LogoutIcon from "@mui/icons-material/Logout";
//
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { chat_skeleton } from "../../skeleton.js";

export const App = () => {
  //
  const API =
    window.location.host === "localhost:3000"
      ? "http://localhost:8080"
      : "https://whatsup-api-production.up.railway.app";
  const SOCKET_API =
    window.location.host === "localhost:3000"
      ? "http://localhost:8900"
      : "https://whatsup-socket.herokuapp.com";

  const navigate = useNavigate();

  //
  const [chatBoxOpen, setChatBoxOpen] = useState(false);

  // logged-in user
  const currentUser = JSON.parse(localStorage.getItem("whatsupuser"));

  const [contact, setContact] = useState(false);
  const [contactList, setContactList] = useState(null);

  const [currentChat, setCurrentChat] = useState(null);

  const handleLogout = () => {
    navigate("/");
    localStorage.removeItem("whatsupuser");
  };

  useEffect(() => {
    async function getChats() {
      try {
        const res = await axios.get(`${API}/chat/get-chat/${currentUser?._id}`);
        setContactList(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    getChats();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, []);

  return (
    <div>
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
              Hello, {currentUser?.name} !
            </div>
            <div className="app-topbar-right">
              <PersonAddIcon
                className="app-person-add-icon"
                onClick={() => setContact(true)}
              />
              <LogoutIcon
                className="app-more-vert-icon"
                onClick={handleLogout}
              />
              {/* <HomeModal className="app-home-modal-component" /> */}
            </div>
          </div>
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
                  <h3 className="app-emp">Add Contacts to Chat</h3>
                )}
              </>
            </div>
          </div>
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
