import "./layout.css";
// components
import Chat from "../Chat/Chat.jsx";
import ContactList from "../ContactList/ContactList.jsx";
import ChatContainer from "../ChatContainer/ChatContainer.jsx";
// icons
import SearchIcon from "@mui/icons-material/Search";
//
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import socket from "../../config/socket.config.js";
import { Close } from "@mui/icons-material";
import { Button } from "@chakra-ui/react";
import { API } from "../../constant.js";
import { v4 as uuidv4 } from "uuid";


export const App = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const chatId = params.chatId ?? null;
  const [tab, setTab] = useState(1);
  const chatBoxOpen = params.chatId ? true : false;

  // logged-in user
  const currentUser = JSON.parse(localStorage.getItem("whatsupuser"));

  const [contact, setContact] = useState(false);
  const [chatList, setChatList] = useState([]);
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
        setChatList(res.data.chats);
      }
    } catch (error) {
    }
  }, []);

  const getUserDetails = async () => {
    try {
      let response = await axios.get(`${API}/user/${currentUser?._id}`);

      if (!response.data.error) {
        setContactList(response.data.data.contacts);
      }
    } catch (error) {

    }
  }

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

      setChatList((prev) => {
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
      setChatList((prev) => {
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
        setChatList((prev) => {
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

  }, [chatId, location.pathname]);


  useEffect(() => {
    getUserDetails();
  }, [])


  const handleAddContact = async (e, contact) => {
    e.stopPropagation();
    // contact --> {name, contact}
    try {
      let payload = { newContact: contact._id, type: "add_to_contact" };
      let response = await axios.put(`${API}/user/${currentUser?._id}`, payload);
      console.log("response :: ", response)
      if (!response.data.error) {
        setContactList((prev) => {
          return [...response.data.contacts, ...prev].sort((a, b) => {
            if (a.name < b.name) return -1; // a comes before b
            if (a.name > b.name) return 1;  // a comes after b
            return 0;                       // a and b are equal
          })
        })

        setSearchValue("");
        setSearchResults([])
      }
    } catch (error) {

    }
  }


  return (
    <div>
      <div className="app-wrapper">
        <div className={chatBoxOpen ? "app-left app-chatbox" : "app-left"}>
          {/* <div className={contact ? "cl-component-open" : "cl-component-close"}>
            <ContactList
              chatList={chatList}
              setChatList={setChatList}
            />
          </div> */}
          <div className="app-left-topbar">

            <div className="tab chat_tab" onClick={() => {
              console.log("chats")
              navigate("/user/chats")
            }}>
              Chats
            </div>
            <div className="tab contacts_tab" onClick={() => {
              console.log("conatcts")
              navigate("/user/chats")
            }}>
              Contacts
            </div>
            <div className="tab profile_tab" onClick={() => {
              console.log("prpfieol")
              navigate("/user/chats")
            }}>
              Profile
            </div>

          </div>

          {location.pathname.includes("/user/chats") ? (
            <>
              {" "}

              <div className="app-left-chatbox">
                <div className="app-left-searchbox">
                  <div className="app-left-searchbox-wrapper">
                    <input
                      type="text"
                      placeholder="Search chat"
                      className="app-searchbox-input"
                      value={searchValue}
                      onChange={(e) => {
                        // setSearchValue(e.target.value);
                        // if (e.target.value?.length === 10) {
                        //   getPersonByNumber(e.target.value);
                        // }
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
                      chatItem={true}
                      setTab={setTab}
                      handleAddContact={handleAddContact}
                    />
                  ))}
                </div>
                <div className="app-left-chatbox-wrapper">

                  {chatList?.length > 0 && chatList?.map((item) => {

                    return (
                      <Chat
                        key={item._id}
                        item={item}
                        setCurrentChat={setCurrentChat}
                        search={false}
                        chatItem={true}
                      />
                    )
                  })}

                  {chatList?.length === 0 && (
                    <h3 className="app-emp">No Chats !</h3>
                  )}

                </div>
              </div>{" "}
            </>
          ) : location.pathname.includes("/user/contacts") ? (
            <>
              <div className="app-left-searchbox">
                <div className="app-left-searchbox-wrapper">

                  {/* search input */}
                  <input
                    type="text"
                    placeholder="Search contact"
                    className="app-searchbox-input"
                    value={searchValue}
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                      if (e.target.value?.length === 10) {
                        getPersonByNumber(e.target.value);
                      }
                    }}
                  />

                  {/* close icon */}
                  {searchValue?.length !== 0 && <Close onClick={() => {
                    setSearchValue("");
                    setSearchResults([]);
                  }} />}

                  {/* search icon */}
                  <SearchIcon />
                </div>

              </div>
              {/* list of found contact + already existing contacts filtered out */}
              {searchResults?.length > 0 && (
                <div>
                  <div className="my-10">Search Results</div>
                  {searchResults?.map((item) => (
                    <Chat
                      key={item._id}
                      item={item}
                      setCurrentChat={setCurrentChat}
                      chatBoxOpen={chatBoxOpen}
                      search={true}
                      chatItem={false}
                      setTab={setTab}
                      handleAddContact={handleAddContact}
                    />
                  ))}
                </div>
              )}
              <div className="my-10">Your Contacts</div>
              {contactList?.length > 0 ?
                <div className="">
                  {contactList?.map((item) => {
                    console.log("contactList :: ", contactList)
                    return (
                      <Chat
                        key={item._id}
                        item={item}
                        setCurrentChat={setCurrentChat}
                        chatBoxOpen={chatBoxOpen}
                        chats={chatList}
                        search={false}
                        chatItem={false}
                        setTab={setTab}
                        handleAddContact={() => { }}
                      />
                    )
                  })}
                </div> : <div className="">You have no saved contacts</div>
              }
            </>
          ) : location.pathname.includes("/user/profile") ?
            (<div
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
              <div>

                <div>
                  {currentUser?.name}
                </div>
                <div>

                  {currentUser?.contact}
                </div>
              </div>
              <Button onClick={handleLogout}>Logout</Button>
            </div>) : null
          }
        </div>

        <div className={!chatBoxOpen ? "app-right" : "app-right app-chatbox"}>
          {chatId !== null ? <ChatContainer
            currentChat={currentChat}
            setCurrentChat={setCurrentChat}
            chatBoxOpen={chatBoxOpen}
            chatList={chatList}
            setChatList={setChatList}
          /> :
            <p className="cc-emp">Select chat to have conversation</p>
          }
        </div>
      </div>
    </div >
  );
};
