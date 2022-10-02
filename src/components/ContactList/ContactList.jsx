import "./contactList.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState } from "react";
import axios from "axios";

const ContactList = ({ contact, setContact, contactList, setContactList }) => {
  const [searching, setSearching] = useState(false);
  // new contact deatils
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  // currentUser data
  const currentUser = JSON.parse(localStorage.getItem("whatsupuser"));

  const handleAddContact = async () => {
    const newContact = {
      contact: number,
      name,
      userId: currentUser._id,
    };

    if (number.length === 0 || name.length === 0 || number.length !== 10) {
      alert("Enter valid details");
    } else if (newContact.contact === currentUser.contact) {
      alert("You cannot add your own number");
      setNumber("");
      setName("");
    } else {
      try {
        const addContact = await axios.post(
          "http://localhost:8080/chat/create-chat",
          newContact
        );
        alert(addContact.data.msg);
        setNumber("");
        setName("");
      } catch (error) {
        console.log(error);
        setNumber("");
        setName("");
      }
    }

    // setContactList([...contactList, newContact]);
  };

  return (
    <div className="cl">
      <div className="cl-wrapper">
        <div className="cl-top">
          <ArrowBackIcon onClick={() => setContact(false)} />
          <h3 className="cl-top-heading">New Contact</h3>
        </div>
        <div className="cl-middle">
          {/* <div className="cl-search-label">Add contact number</div> */}
          <div className="cl-input-wrapper">
            <div className="cl-input-label">Name</div>
            <input
              type="text"
              placeholder="ex- John Doe"
              className="cl-search-input"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <div className="cl-input-label">Mobile Number</div>
            <input
              type="number"
              placeholder="+91 9595949422"
              className="cl-search-input"
              onChange={(e) => setNumber(e.target.value)}
              value={number}
            />
          </div>
          <span>
            <button className="cl-search-button" onClick={handleAddContact}>
              Save
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ContactList;
