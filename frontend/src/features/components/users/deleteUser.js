import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCurrentUser } from "../../slices/loginSlice";
import { logout } from "../../slices/loginSlice";
import { removeAllUserMemes } from "../../slices/memeSlice";
import { removeAllUserComments } from "../../slices/commentsSlice";
import { removeUser } from "../../slices/userSlice";

const DeleteUser = ({ uid }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const currentUser = useSelector(selectCurrentUser);
  
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/users/${uid}`);
      dispatch(removeAllUserMemes(uid));
      dispatch(removeAllUserComments(uid));
      dispatch(removeUser(uid));
      if (uid === currentUser.uid){
        await axios.post('http://localhost:8080/api/users/logout',
          {}, {withCredentials: true});
        dispatch(logout);
        navigate('/login');
      }
      else navigate('/admin');
    } catch (error) {
      setMessage(error.response.data.message);
      console.log(error);
    }
  }
  
  return (
    <div className="content-box">
      <div>{message}</div>
      <button onClick={handleDelete}>DELETE USER</button>
    </div>
  )
};
  
export default DeleteUser;