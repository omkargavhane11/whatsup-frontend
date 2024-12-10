import "./chat.css";
import moment from "moment";
import PERSON_IMAGE from "../../assets/person_image.jpg";
import axios from "axios";
import { API } from "../../constant";
import { useNavigate } from "react-router-dom";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import socket from "../../config/socket.config";
import { useState } from "react";


const Chat = ({
  item,
  search = false,
  setTab = null,
  chatItem = false, setCurrentChat = {},
  chats = [],
  handleAddContact = () => { }
}) => {
  console.log("chats list :: ", chats)
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("whatsupuser"));

  const ChatUser = !search ? item?.members?.find(
    (member) => member?._id !== currentUser?._id
  ) : item;

  let messageDate = item?.lastMessage?.createdAt;

  const handleCreateChat = async (contact) => {
    try {
      const res = await axios.post(`${API}/chat/create-chat`, { userId: currentUser?._id, contact });
      if (!res.data.error) {
        return res?.data?.data?._id
      }
      return null;
    } catch (error) {
      // console.log(error);
      return null;
    }
  }



  const handleOnChatClick = () => {
    try {
      console.log(item)
      console.log(currentUser?._id)
      console.log(item?.lastMessage?.senderId === currentUser?._id)
      if (item?.lastMessage?.senderId !== currentUser?._id) {
        socket?.emit("send-last-read-msg", { chatId: item?._id, receiverId: ChatUser?._id });
        console.log("slrm sent :: ")
      }
      setCurrentChat(item);
      navigate(`/user/chats/${item?._id}`)
    } catch (error) {

    }
  }

  const handleOnContactClick = async () => {
    try {
      console.log("chats :: ", chats)
      //  check if chat exists with this contact id
      let isChatPresentWithContact = chats.find((c) => c.members.map((i) => i._id).includes(item._id)) ?? false
      console.log("isChatPresentWithContact :: ", isChatPresentWithContact)
      // if not, make API call to create contact and then navigate to the id returned
      if (!isChatPresentWithContact) {
        let newChatId = await handleCreateChat(item?.contact);
        console.log("newChatId :: ", newChatId)
        if (newChatId !== null) {
          navigate(`/user/chats/${newChatId}`);
        }
      }
      // if exists, navigate to the chat id
      if (isChatPresentWithContact) {
        navigate(`/user/chats/${isChatPresentWithContact?._id}`);
      }
    } catch (error) {
      console.log("error :: ", error.message)
    }
  }



  return !search && chatItem ? (
    <div
      className="chat"
      onClick={handleOnChatClick}
    >
      <div className="chat-wrapper">
        <div className="chat-left">
          <img
            style={{ width: "40px", height: "40px" }}
            src={PERSON_IMAGE}
            alt="user"
            className="chat-avatar"
          />
        </div>
        <div className="chat-right">
          <div className="chat-right-top">
            <div className="chat-contact-name">
              {ChatUser?.name ?? item?.name}
            </div>
            {!search ? <p className={item?.unreadMsgCount > 0 ? "chat-lastest-msg-time-green" : "chat-lastest-msg-time"}>
              {messageDate < new Date(messageDate).setHours(0, 0, 0, 0)
                ? moment(messageDate).format("L")
                : moment(messageDate).format("LT")}
            </p> : <button className="chat-add_button" onClick={(e) => handleAddContact(e, item)}>add</button>}
          </div>
          <div className="chat-right-top">
            {!search ? <div className="chat-latest-msg">{item?.lastMessage?.senderId === currentUser?._id ? <DoneAllIcon sx={{ color: item?.lastMessage?.isRead ? "#53bdeb" : "grey", fontSize: "18px" }} /> : null}{item?.lastMessage?.message ?? "No messages yet"}</div> : <div>{item?.contact}</div>}
            {item?.unreadMsgCount > 0 && <div className="chat-unreadMessageCount">{item?.unreadMsgCount}</div>}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div
      className="chat"
      onClick={handleOnContactClick}
    >
      <div className="chat-wrapper">
        <div className="chat-left">
          <img
            style={{ width: "40px", height: "40px" }}
            src={PERSON_IMAGE}
            alt="user"
            className="chat-avatar"
          />
        </div>
        <div className="chat-right">
          <div className="chat-right-top">
            <div className="chat-contact-name">
              {ChatUser?.name ?? item?.name}
            </div>
            {search && <button className="chat-add_button" onClick={(e) => handleAddContact(e, item)}>Add</button>}
          </div>
          <div className="chat-right-top">
            <div className="chat-contact-name">
              {ChatUser?.contact ?? item?.contact}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Chat;
