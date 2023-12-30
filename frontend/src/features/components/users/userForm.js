import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ImagePreview from "../other/imagePreview";

const UserForm = ({handleSubmit, message, creating}) => {
  const validationSchema = Yup.object().shape({
    login: creating ? Yup.string().required("Login is required")
      .max(30, "Login must be maximum 30 characters") : 
    Yup.string().notRequired("Login is not required")
      .max(30, "Login must be maximum 30 characters"),
    password: creating ? Yup.string()
      .required("Password is required")
      .min(5, "Password must be at least 5 characters")
      .max(30, "Password must be maximum 30 characters") : 
      Yup.string().notRequired("Password is not required")
      .min(5, "Password must be at least 5 characters")
      .max(30, "Password must be maximum 30 characters"),
    passwordConfirmation: Yup.string()
      .when("password", {
      is: val => val && val.length > 0,
      then: Yup.string().required("Password confirmation is required"),
      otherwise: Yup.string().notRequired("Password confirmation is not required"),
      }),
    image: Yup.mixed()
      .test("FILE_SIZE", "Image too big - max 1mb!", (value) => {
        if(value){
          return value.size < 1024 * 1024
        }
        return true;
      })
      .test("FILE_TYPE", "Unsupported file type", (value) => {
        if(value){
          const allowedTypes = ["image/png", "image/jpeg"];
          return allowedTypes.includes(value.type);
        }
        return true;
      })
      .nullable()
    });


  return (
    <Formik
      initialValues={{
        login: "",
        password: "",
        passwordConfirmation: "",
        image: null,
        code: ""
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, setFieldValue, values }) => (
        <Form className="content-box">
          <Field type="text" name="login" placeholder="Login" />
          <ErrorMessage name="login" component="div" />
          <Field type="password" name="password" placeholder="Password" />
          <ErrorMessage name="password" component="div" />
          <Field
            type="password"
            name="passwordConfirmation"
            placeholder="Confirm Password"
          />
          <ErrorMessage name="passwordConfirmation" component="div" />
          <input type="file" accept="image/png, image/jpeg"
            onChange={(e) => setFieldValue("image",e.target.files[0])} />
          <ErrorMessage name="image" component="div" />
          {values.image && <ImagePreview file={values.image} />}
          <label>Admin</label>
          <Field name="admin" type="checkbox" />
          {values.admin && (
            <Field type="text" name="code" placeholder="Admin Code" />
          )}
          <div>{message}</div>
          <button type="submit" disabled={isSubmitting}>
            {creating ? <>CREATE ACCOUNT</> : <>UPDATE</>}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default UserForm;