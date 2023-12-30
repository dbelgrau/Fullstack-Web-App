import React, { useState } from "react";
import MemeForm from "./memeForm";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import { selectCurrentUser } from "../../slices/loginSlice";
import { addMeme } from "../../slices/memeSlice";

const AddMeme = () => {
  const [message, setMessage] = useState();
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();
      formData.append('id', uuidv4());
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('category', values.category);
      formData.append('image', values.image);
      formData.append('uid', currentUser.uid);
      const response = await axios.post('http://localhost:8080/api/memes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage(response.data.message);
      dispatch(addMeme(response.data.meme));
      setSubmitting(false);
      resetForm();
    } catch (error) {
      setMessage(error.response.data.message);
      setSubmitting(false);
    }
  };

  const values = {
    title: '',
    description: '',
    categoty: '',
  }

  return (
    <>{ currentUser && <MemeForm 
        values={values} 
        message={message} 
        handleSubmit={handleSubmit}
        creating={true}
      />}</>
  );
};

export default AddMeme;