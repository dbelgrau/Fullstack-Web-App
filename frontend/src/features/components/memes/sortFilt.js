import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const SortFilt = ({ setSort, filt, setFilt }) => {
  const [ifSorting, setIfSorting] = useState(false);
  const [ifFinding, setIfFinding] = useState(false);
  const [actSort, setActSort] = useState(0);

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
            }}>NEWEST</button>
            <button className={actSort === 1 ? 'active' : ''} onClick={() => {
              setSort({ date: -1 });
              setActSort(1);
            }}>OLDEST</button>
            <button className={actSort === 2 ? 'active' : ''} onClick={() => {
              setSort({ title: 1 });
              setActSort(2);
            }}>A-Z</button>
            <button className={actSort === 3 ? 'active' : ''} onClick={() => {
              setSort({ title: -1 });
              setActSort(3);
            }}>Z-A</button>
            <button className={actSort === 4 ? 'active' : ''} onClick={() => {
              setSort({ rating: 1 });
              setActSort(4);
            }}>BEST</button>
            <button className={actSort === 5 ? 'active' : ''} onClick={() => {
              setSort({ rating: -1 });
              setActSort(5);
            }}>WORST</button>
          </div>
        </div>
      )}
      {ifFinding && (
        <div className='meme-buttons box-item'>
          <div className='filter-form'>
            <Formik
              initialValues={{ title: '', date: '', newer: false }}
              onSubmit={(values, { setSubmitting}) => {
                let filter = {...filt};
                setFilt({...filter, title: values.title, date:values.date, newer: values.newer});
                setSubmitting(false);
              }}
              onReset={() => setFilt({})}
            >
              {({ isSubmitting, values }) => (
                <Form>
                  <label>FILTER BY TITLE</label>
                  <Field type="text" name="title" placeholder="Enter a title" />
                  <ErrorMessage name="title" component="div" />
                  <label>FILTER BY DATE</label>
                  <Field type="date" name="date" placeholder="Enter a date" />
                  <ErrorMessage name="date" component="div" />
                  {values.date !== '' && <div className='checkbox'>
                    <Field type="checkbox" name="newer" />
                    <label>FROM GIVEN DATE TO NOW</label>
                    <ErrorMessage name="newer" component="div" />
                  </div>}
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

export default SortFilt;