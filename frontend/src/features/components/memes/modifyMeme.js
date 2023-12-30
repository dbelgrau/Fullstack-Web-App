import React, { useState } from "react";
import MemeForm from "./memeForm";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../slices/loginSlice";
import { updateMeme } from "../../slices/memeSlice";

const ModifyMeme = ({meme}) => {
  const [message, setMessage] = useState();
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('category', values.category);
      formData.append('image', values.image);
      const response = await axios.put(`http://localhost:8080/api/memes/${meme.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      //console.log(response.data);
      setMessage(response.data.message);
      dispatch(updateMeme(response.data.meme));
      setSubmitting(false);
      resetForm();
    } catch (error) {
      setMessage(error.response.data.message);
      setSubmitting(false);
    }
  };

  const values = {
    title: meme.title,
    description: meme.description,
    category: meme.category,
  }

  return (
    <>{ currentUser && <MemeForm 
        values={values} 
        message={message} 
        handleSubmit={handleSubmit}
        creating={false} 
      />}</>
  );
};

export default ModifyMeme;