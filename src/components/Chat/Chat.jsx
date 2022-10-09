import "./chat.css";
import moment from "moment";

const Chat = ({
  item,
  currentChat,
  setCurrentChat,
  chatBoxOpen,
  setChatBoxOpen,
}) => {
  const currentUser = JSON.parse(localStorage.getItem("whatsupuser"));

  const ChatUser = item?.members?.find(
    (member) => member?._id !== currentUser?._id
  );

  return (
    <div
      className="chat"
      onClick={() => {
        setCurrentChat(item);
        setChatBoxOpen(true);
      }}
    >
      <div className="chat-wrapper">
        <div className="chat-left">
          <img
            src="https://p.kindpng.com/picc/s/21-211168_transparent-person-icon-png-png-download.png"
            alt="user-image"
            className="chat-avatar"
          />
        </div>
        <div className="chat-right">
          <div className="chat-right-top">
            <div className="chat-contact-name">{ChatUser?.contact}</div>
            <p className="chat-lastest-msg-time">
              {moment(item?.lastMessage?.time).format("lll")}
            </p>
          </div>
          <div className="chat-latest-msg">{item?.lastMessage?.message}</div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
