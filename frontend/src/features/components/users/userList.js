import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUsers } from '../../slices/userSlice';
import CreateAccount from '../pages/createAccount';
import User from './user';
import UserSortFilt from './userSortFilt';

const UserList = ({  changable = true }) => {
  const [sort, setSort] = useState({role: 1});
  const [filt, setFilt] = useState({});
  
  const users = useSelector(state => 
    selectUsers(state, filt, sort));
    const [showAdd, setShowAdd] = useState(false);

  return (
    <div className='meme-list'>
      {!users || users.loading ? 
        <p>Loading...</p> : 
        <div>
          {changable && <UserSortFilt setSort={setSort} setFilt={setFilt}/> }
          {users.map(user => (
            <User key={user.uid} uid={user.uid}/>
          ))}
          <div className='content-box'>
            <button onClick={() => setShowAdd(!showAdd)}>ADD USER</button>
          </div>
          {showAdd && <CreateAccount />}
        </div>
      }
    </div>
  );
}

export default UserList;
