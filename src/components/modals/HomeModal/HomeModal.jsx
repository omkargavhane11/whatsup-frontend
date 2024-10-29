import "./homeModal.css";

const HomeModal = ({ handleLogout }) => {
  return (
    <div className="home-modal">
      <button onClick={handleLogout}>logout</button>
    </div>
  );
};

export default HomeModal;
