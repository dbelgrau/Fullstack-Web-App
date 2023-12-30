//import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectCurrentUser } from '../../slices/loginSlice';
import { fetchUsers } from '../../slices/userSlice';
import BanUser from './banUser';
import DeleteUser from './deleteUser';
import MemeList from '../memes/memeList';
import ModifyUser from './modifyUser';

const UserInfo = () => {
  const { uid } = useParams();
  const users = useSelector(state => state.users.users);
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!users || users.length === 0) {
      dispatch(fetchUsers());
    }
  }, [uid, users, dispatch]);

  const user = users.find(u => u.uid === uid);
  let date = null;
  if (user) date = new Date(user.created_at).toLocaleString();

  return (
    <div className='main'>
      {(user && currentUser) ? 
        <>
          <div className='content-box'>
            <h2 className='box-item'>USER {user.name}</h2>
            {user.role === 'admin' && <h2 className='box-item'>ADMINISTRATOR</h2>}
            {user.role === 'banned' && <h2 className='box-item'>BANNED</h2>}
            <div className='box-item'>Account created: {date}</div>
            <img className='meme-image box-item' src={user.image} alt={user.name} />
          </div>
          {(user.uid === currentUser.uid || currentUser.role === 'admin') && 
            <div>
              <div className='content-box'>
                <button onClick={() => setIsEditing(!isEditing)}>EDIT USER</button>
              </div>
              {isEditing &&
                <>{(currentUser.role === 'admin' && user.role !== 'admin') && <BanUser user={user} />}
                  <ModifyUser name={user.name} />
                  <DeleteUser uid={user.uid} />
                </>
              }
            </div>}
            <div className='content-box'>
              <h2 className='box-item'>USER MEMES</h2>
            </div>
            <MemeList favorite={false} uid={user.uid}/>
        </>
        : <div>Loading...</div>
      }
    </div>
  );
};

export default UserInfo;