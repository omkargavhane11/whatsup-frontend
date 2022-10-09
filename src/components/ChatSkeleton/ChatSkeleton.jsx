import "./chatSkeleton.css";

const ChatSkeleton = () => {
  return (
    <div className="skeleton-chat">
      <div className="skeleton-chat-wrapper">
        <div className="skeleton-chat-left">
          <div className="skeleton-chat-avatar" />
        </div>
        <div className="skeleton-chat-right">
          <div className="skeleton-chat-right-top">
            <div className="skeleton-chat-contact-name"></div>
            <p className="skeleton-chat-lastest-msg-time"></p>
          </div>
          <div className="skeleton-chat-latest-msg"></div>
        </div>
      </div>
    </div>
  );
};

export default ChatSkeleton;
