import "./message.css";
import moment from "moment";

const Message = ({ currentUser, msg }) => {
  const msgTime = moment(msg?.createdAt).format("lll");
  return (
    <div className={currentUser ? "msg-my" : "msg"}>
      <div className="msg-body">{msg?.message}</div>
      <div className="msg-time">{msgTime}</div>
    </div>
  );
};

export default Message;
