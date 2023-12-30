import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const UserSortFilt = ({ setSort, setFilt }) => {
  const [ifSorting, setIfSorting] = useState(false);
  const [ifFinding, setIfFinding] = useState(false);
  const [actSort, setActSort] = useState(4);

  return (
    <div className='content-box'>
      <div className='flex-row'>
        <button onClick={() => {
          setIfSorting(!ifSorting);
          setIfFinding(false);
        }}>SORTING</button>
        <button onClick={() => {
          setIfFinding(!ifFinding);
          setIfSorting(false);
        }}>FILTER</button>
      </div>
      {ifSorting && (
        <div className='meme-box'>
          <div className='sort-buttons box-item'>
          <button className={actSort === 0 ? 'active' : ''} onClick={() => {
              setSort({ date: 1 });
              setActSort(0);
            }}>YOUNGEST</button>
            <button className={actSort === 1 ? 'active' : ''} onClick={() => {
              setSort({ date: -1 });
              setActSort(1);
            }}>OLDEST</button>
            <button className={actSort === 2 ? 'active' : ''} onClick={() => {
              setSort({ name: 1 });
              setActSort(2);
            }}>A-Z</button>
            <button className={actSort === 3 ? 'active' : ''} onClick={() => {
              setSort({ name: -1 });
              setActSort(3);
            }}>Z-A</button>
            <button className={actSort === 4 ? 'active' : ''} onClick={() => {
              setSort({ role: 1 });
              setActSort(4);
            }}>ROLE</button>
            <button className={actSort === 5 ? 'active' : ''} onClick={() => {
              setSort({ role: -1 });
              setActSort(5);
            }}>ROLE INV</button>
          </div>
        </div>
      )}
      {ifFinding && (
        <div className='meme-buttons box-item'>
          <div className='filter-form'>
            <Formik
              initialValues={{ name: '', date: '', role: '' }}
              onSubmit={(values, { setSubmitting }) => {
                setFilt({name: values.name, date:values.date, role: values.role});
                setSubmitting(false);
              }}
              onReset={() => setFilt({})}
            >
              {({ isSubmitting }) => (
                <Form>
                  <label>FILTER BY NAME</label>
                  <Field type="text" name="name" placeholder="Enter a name" />
                  <ErrorMessage name="name" component="div" />
                  <label>FILTER BY CREATION DATE</label>
                  <Field type="date" name="date" placeholder="Enter a date" />
                  <ErrorMessage name="date" component="div" />
                  <label>FILTER BY ROLE</label>
                  <Field name="role" as="select">
                    <option value="">ALL</option>
                    <option value="admin">ADMIN</option>
                    <option value="user">USER</option>
                    <option value="banned">BANNED</option>
                  </Field>
                  <ErrorMessage name="role" component="div" />
                  <div className='flex-row'>
                    <button type="submit" disabled={isSubmitting}>
                      FILTER
                    </button>
                    <button type="reset">
                      CLEAR
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserSortFilt;