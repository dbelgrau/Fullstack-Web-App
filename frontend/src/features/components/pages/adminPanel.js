import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { selectCurrentUser } from '../../slices/loginSlice';
import UserList from '../users/userList';
import WrongAddress from './wrongAddress';

const AdminPanel = () => {
  const [showList, setShowList] = useState(false);

  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    //currentUser?.role !== 'admin' && navigate('/nope');
  }, []);

  const getMemesCsv = async () => {
    const response = await axios.get('http://localhost:8080/api/database/memes', { responseType: 'blob', withCredentials: true });
    const file = new Blob([response.data], { type: 'text/csv' });
    const fileURL = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = fileURL;
    link.setAttribute('download', 'memes.csv');
    document.body.appendChild(link);
    link.click();
  };
  
  const getUsersCsv = async () => {
    const response = await axios.get('http://localhost:8080/api/database/users', { responseType: 'blob', withCredentials: true });
    const file = new Blob([response.data], { type: 'text/csv' });
    const fileURL = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = fileURL;
    link.setAttribute('download', 'users.csv');
    document.body.appendChild(link);
    link.click();
  };

  const getAllCsv = async () => {
    const response = await axios.get('http://localhost:8080/api/database/csv', { responseType: 'blob', withCredentials: true });
    const file = new Blob([response.data], { type: 'text/csv' });
    const fileURL = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = fileURL;
    link.setAttribute('download', 'db.csv');
    document.body.appendChild(link);
    link.click();
  };

  const getDBCypher = async () => {
    const response = await axios.get('http://localhost:8080/api/database/cypher', { responseType: 'blob', withCredentials: true });
    const file = new Blob([response.data], { type: 'text/cypher' });
    const fileURL = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = fileURL;
    link.setAttribute('download', 'db.cypher');
    document.body.appendChild(link);
    link.click();
  };

  const [file, setFile] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const importCypher = async (event) => {
    event.preventDefault();
    if (file) {
      setIsSending(true);
      const formData = new FormData();
      formData.append('file', file);
      const res = await axios.post('http://localhost:8080/api/database/import', formData, {withCredentials: true});
      setMessage(res.data.message);
      setIsSending(false)
    }
    else {
      setMessage('No file');
    }
  };

  return (
    <>
      {currentUser?.role === 'admin' ? <div className='main'>
        <div className='content-box'>
          <Link className='box-item' to={'/spam'}>GO TO SPAM</Link>
        </div>
        <div className='content-box'>
          <div className='meme-buttons flex-row'>
            <button onClick={getMemesCsv}>DOWNLOAD memes.csv</button>
            <button onClick={getUsersCsv}>DOWNLOAD users.csv</button>
            <button onClick={getAllCsv}>DOWNLOAD db.csv</button>
            <button onClick={getDBCypher}>DOWNLOAD db.cypher</button>
          </div>
        </div>
        <form className='content-box' onSubmit={importCypher}>
          <input type='file' name='file' accept='.cypher' onChange={onFileChange} />
          <div>{message}</div>
          <button type='submit' disabled={isSending}>IMPORT cypher</button>
        </form>
        <div className='content-box'>
          <button onClick={() => setShowList(!showList)}>SHOW USERS LIST</button>
        </div>
        {showList && <UserList />}
      </div> :
      <WrongAddress/> }
    </>
  );
};

export default AdminPanel;
