import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCurrentUser } from '../../slices/loginSlice';
import CommentForm from './commentForm';

const Comment = ({ comment, handleDelete, handleUpdate }) => {
  const users = useSelector(state => state.users.users);
  const user = users.find(u => u.uid === comment.uid);
  const currentUser = useSelector(selectCurrentUser);

  const [editing, setEditing] = useState(false);

  return (
    <div className='content-box'>
      {(user && currentUser) ?
      <div className='comment-box'>
        <div className='comment-item'>
          <Link className='author-box' to={`/user/${comment.uid}`}>
            <img className='comment-icon' src={user.image} alt={user.name} />
            <h5>{user.name} {new Date(comment.added_at).toLocaleString()}</h5>
          </Link>
          {(user.uid === currentUser.uid || currentUser.role === 'admin') &&
          <div className='comment-buttons'>
            <button onClick={() => setEditing(!editing)}>EDIT</button>
            <button onClick={() => handleDelete(comment.cid)}>DELETE</button>
          </div>} 
        </div>
        {!editing ? 
          <p className='comment-item'>{comment.content}</p> :
          <CommentForm 
            handleSubmit={handleUpdate}
            content={comment.content}
            cid={comment.cid}
            setEditing={setEditing}
          />
        }
      </div> :
      <div>Loading...</div>}
    </div> 
  );
};

export default Comment;