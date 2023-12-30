import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectMemes } from '../../slices/memeSlice';

const User = ({ uid }) => {
  const users = useSelector(state => state.users.users);
  const user = users.find(u => u.uid === uid);
  const memeCount = useSelector(state => selectMemes(state, null, null, null, uid)).length;

  return (
    <div className='content-box'>
      {user ?
      <div key={uid} className='meme-box'>
        <Link className='author-box box-item' to={`/user/${uid}`}>
          <img className='user-icon' src={user.image} alt={user.name} />
          <div>
            <h4>{user.name}</h4>
            <h5>{new Date(user.created_at).toLocaleString()}</h5>
          </div>
        </Link>
        <div className='box-item'>
          {user.role === 'admin' && <h3 className='admin-role'>
            {user.role.toUpperCase()}
          </h3>}
          {user.role === 'banned' && <h3 className='banned-role'>
            {user.role.toUpperCase()}
          </h3>}
          {user.role === 'user' && <h3>
            {user.role.toUpperCase()}
          </h3>}
          <div>Memes: {memeCount}</div>
        </div>
      </div> :
      <div>Loading...</div>}
    </div> 
  );
};

export default User;