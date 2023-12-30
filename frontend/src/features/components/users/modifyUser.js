import React, { useState } from "react";
import axios from "axios";
import UserForm from "./userForm";
import { useParams } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { updateUser } from "../../slices/userSlice";

const ModifyUser = () => {

  const [message, setMessage] = useState('');
  const { uid } = useParams();
  const dispatch = useDispatch();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();
      formData.append('name', values.login);
      formData.append('password', values.password);
      formData.append('image', values.image);
      formData.append('code', values.code);
      const response = await axios.put(`http://localhost:8080/api/users/${uid}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      dispatch(updateUser(response.data.user));
      setMessage(response.data.message);
      setSubmitting(false);
      resetForm();
    } catch (error) {
      setMessage(error.response.data.message);
      setSubmitting(false);
    }
  };

  return(
    <UserForm handleSubmit={handleSubmit} message={message} creating={false}/>
  )  
};

export default ModifyUser;
