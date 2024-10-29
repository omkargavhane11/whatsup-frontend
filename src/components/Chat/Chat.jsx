import "./chat.css";
import moment from "moment";
import PERSON_IMAGE from "../../assets/person_image.jpg";

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

  let messageDate = item?.lastMessage?.createdAt;

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
            style={{ width: "40px", height: "40px" }}
            src={PERSON_IMAGE}
            alt="user"
            className="chat-avatar"
          />
        </div>
        <div className="chat-right">
          <div className="chat-right-top">
            <div className="chat-contact-name">
              {ChatUser?.name}{" "}
              {/* <span style={{ fontSize: "12px" }}>{ChatUser?.contact}</span> */}
            </div>
            <p className="chat-lastest-msg-time">
              {messageDate < new Date(messageDate).setHours(0, 0, 0, 0)
                ? moment(messageDate).format("L")
                : moment(messageDate).format("LT")}
            </p>
          </div>
          <div className="chat-latest-msg">{item?.lastMessage?.senderId === currentUser?._id ? "✔ " : ""}{item?.lastMessage?.message}</div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
