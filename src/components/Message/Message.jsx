import "./message.css";
import moment from "moment";
import DoneAllIcon from '@mui/icons-material/DoneAll';

const Message = ({ currentUser, msg }) => {
  const msgTime = moment(msg?.createdAt).format("LT");
  return (
    <div className={currentUser ? "msg-my" : "msg"}>
      <div className="msg-body">{msg?.message}</div>
      <div className="msg-time"> {msgTime}{" "}{currentUser ? <DoneAllIcon sx={{ color: msg?.isRead ? "#53bdeb" : "grey", fontSize: "14px" }} /> : null} </div>
    </div>
  );
};

export default Message;
