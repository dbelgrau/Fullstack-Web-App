import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ImagePreview from "../other/imagePreview";

const MemeForm = ({handleSubmit, message, values, creating}) => {

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required")
      .min(5, "Tiutle must be at least 5 characters")
      .max(100, "Title must be maximum 100 characters"),
    description: Yup.string()
      .required('Description is required')
      .max(300, "Description must be maximum 300 characters"),
    image: Yup.mixed()
      .test("FILE_SIZE", "Image too big - max 1mb!", (value) => {
        if(value){
          return value.size < 1024 * 1024 * 5
        }
        return true;
      })
      .test("FILE_TYPE", "Unsupported file type", (value) => {
        if(value){
          const allowedTypes = ["image/png", "image/jpeg", "image/gif"];
          return allowedTypes.includes(value.type);
        }
        return true;
      })
      .notRequired(),
    category: Yup.string()
      .required("Category is required"),
  });

  return (
    <Formik
      initialValues={{
        title: values.title,
        description: values.description,
        category: values.category,
        image: null,
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, setFieldValue, values }) => (
        <Form className="content-box">
          <Field type="text" name="title" placeholder="Title" />
          <ErrorMessage name="title" component="div" />
          <Field type="text" name="description" placeholder="Description" />
          <ErrorMessage name="description" component="div" />
          <Field as="select" name="category" placeholder="Category">
            <option value="">Select a category</option>
            <option value="humor">Humor</option>
            <option value="political">Political</option>
            <option value="sports">Sports</option>
            <option value="thoughts">Thoughts</option>
            <option value="nsfw">NSFW</option>
          </Field>
          <ErrorMessage name="category" component="div" />
          <input type="file" accept="image/png, image/jpeg, image/gif"
            onChange={(e) => setFieldValue("image",e.target.files[0])} />
          <ErrorMessage name="image" component="div" />
          {values.image && <ImagePreview file={values.image} />}
          <div>{message}</div>
          <button type="submit" disabled={isSubmitting}>
            {creating ? <>ADD</> : <>UPDATE</>}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default MemeForm;