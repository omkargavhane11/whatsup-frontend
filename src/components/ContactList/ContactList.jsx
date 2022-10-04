import "./contactList.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

const ContactList = ({ contact, setContact, contactList, setContactList }) => {
  const toast = useToast();
  // const [searching, setSearching] = useState(false);
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
      toast({
        description: "Enter valid details",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } else if (newContact.contact === currentUser.contact) {
      toast({
        description: "You cannot add your own number",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setNumber("");
      setName("");
    } else {
      try {
        const addContact = await axios.post(
          "https://whatsup-api-77.herokuapp.com/chat/create-chat",
          newContact
        );
        if (addContact.data.msg.split(" ")[0] !== "Chat") {
          toast({
            description: addContact.data.msg,
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
        } else {
          toast({
            description: addContact.data.msg,
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
        }
        setNumber("");
        setName("");
      } catch (error) {
        console.log(error);
        toast({
          description: error.message,
          status: "info",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
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
