import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { removeMeme } from "../../slices/memeSlice";

const DeleteMeme = ({ id }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/memes/${id}`);
      dispatch(removeMeme(id));
      navigate('/');
    } catch (error) {
      setMessage(error.response.data.message);
      console.log(error);
    }
  }
  
  return (
    <div className="content-box">
      <div>{message}</div>
      <button onClick={handleDelete}>DELETE MEME</button>
    </div>
  )
};
  
export default DeleteMeme;