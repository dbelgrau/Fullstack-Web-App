import React, { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import UserForm from "../users/userForm";
//import { useNavigate } from "react-router-dom";
import { addUser } from "../../slices/userSlice";
import { useDispatch } from 'react-redux';

const CreateAccount = () => {

  const [message, setMessage] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append('uid', uuidv4());
      formData.append('name', values.login);
      formData.append('password', values.password);
      formData.append('image', values.image);
      formData.append('code', values.code);
      const response = await axios.post('http://localhost:8080/api/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      dispatch(addUser(response.data.user));
      setMessage(response.data.message);
      setSubmitting(false);
    } catch (error) {
      setMessage(error.response.data.message);
      setSubmitting(false);
    }
  };

  return(
    <UserForm handleSubmit={handleSubmit} message={message} creating={true}/>
  )  
};

export default CreateAccount;
