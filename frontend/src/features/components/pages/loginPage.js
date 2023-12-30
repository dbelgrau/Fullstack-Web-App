import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../../slices/loginSlice';

const Login = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    try {
      const res = await axios.post('http://localhost:8080/api/users/login', values, {withCredentials: true});
      setMessage(res.data.message);
      if(res.data.logged){
        dispatch(setCurrentUser(res.data.user));
        navigate('/');
      } 
    } catch (error) {
      console.log(error);
      setMessage('Error logging in');
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Login is required"), 
    password: Yup.string().required("Password is required")
  });

  return (
    <Formik
      initialValues={{
        name: "",
        password: "",
        passwordConfirmation: "",
        image: null,
        code: ""
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form className="content-box">
          <Field type="text" name="name" placeholder="Name" />
          <ErrorMessage name="login" component="div" />
          <Field type="password" name="password" placeholder="Password" />
          <ErrorMessage name="password" component="div" />
          <div>{message}</div>
          <button type="submit" >
            Sign in
          </button>
          <Link to='/createAccount'>Sign up</Link>
        </Form>
      )}
    </Formik>
  );
};
  
export default Login;