import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { changeUserRole } from "../../slices/userSlice";

const BanUser = ({ user }) => {
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();

  const handleBan = async () => {
    try {
      const response = await axios.patch(`http://localhost:8080/api/users/ban`, {uid: user.uid});
      dispatch(changeUserRole({uid: user.uid, role: 'banned'}));
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.message);
      console.log(error);
    }
  }

  const handleUnban = async () => {
    try {
      const response = await axios.patch(`http://localhost:8080/api/users/unban`, {uid: user.uid});
      dispatch(changeUserRole({uid: user.uid, role: 'user'}));
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.message);
      console.log(error);
    }
  }
  
  return (
    <div className="content-box">
      <div className="box-item">{message}</div>
      {user.role !== 'banned' ?
        <button onClick={handleBan}>BAN USER</button> :
        <button onClick={handleUnban}>UNBAN USER</button>
     }
    </div>
  )
};
  
export default BanUser;