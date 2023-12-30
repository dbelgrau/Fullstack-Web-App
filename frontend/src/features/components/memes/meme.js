import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import MemeReactions from './memeReactions';

const Meme = ({ meme }) => {
  const users = useSelector(state => state.users.users);
  const user = users.find(u => u.uid === meme.uid);

  return (
    <div className='content-box'>
      {user ?
      <div key={meme.id} className='meme-box'>
        <Link className='author-box box-item' to={`/user/${meme.uid}`}>
          <img className='user-icon' src={user.image} alt={user.name} />
          <h4>{user.name} {new Date(meme.added_at).toLocaleString()}</h4>
        </Link>
        <Link className='box-item' to={`/meme/${meme.id}`}>
          <h2>{meme.title}</h2>
        </Link>
        <p className='box-item'>{meme.description}</p>
        {meme.image && <img className='meme-image box-item' src={meme.image} alt={meme.title} />}
        <MemeReactions meme={meme} />
      </div> :
      <div>Loading...</div>}
    </div> 
  );
};

export default Meme;