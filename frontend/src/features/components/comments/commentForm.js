import React from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from "yup";

const CommentForm = ({ handleSubmit, content, cid, setEditing }) => {

  const validationSchema = Yup.object().shape({
    content: Yup.string().required("Text is required")
      .max(300, "Content must be maximum 300 characters")
  });

  return (
    <Formik
      initialValues={{ content: content }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        if (setEditing) setEditing(false);
        handleSubmit(cid, values);
        resetForm();
    }}
    >
      {({ isSubmitting }) => (
        <Form className="comment-form">
          <Field type="text" name="content" placeholder="Enter your comment"/>
          <ErrorMessage name="content" component="div" />
          <button type="submit" disabled={isSubmitting}>SEND</button>
        </Form>
      )}
    </Formik>
  );
};

export default CommentForm;
