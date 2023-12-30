import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import CommentForm from './commentForm';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '../../slices/loginSlice';
import { addComment, fetchComments, removeComment, selectComments, updateComment } from '../../slices/commentsSlice';
import Comment from './comment';

let socket;

const CommentList = ({ id, number }) => {
  const currentUser = useSelector(selectCurrentUser);
  const comments = useSelector(selectComments);
  const dispatch = useDispatch();

  const [showComments, setShowComments] = useState(false);
  
  useEffect(() => {
    socket = io('http://localhost:8080');
    socket.emit("join-room", id);
    dispatch(fetchComments(id));
    return () => {
      socket.emit("leave-room", id);
      socket.disconnect();
    }
  },[]);

  useEffect(() => {
    socket.on("receive-comment", (comment) => {
      dispatch(addComment(comment));
    });
    socket.on("receive-update-comment", (comment) => {
      dispatch(updateComment(comment));
    });
    socket.on("receive-delete-comment", (cid) => {
      dispatch(removeComment(cid));
    });
  }, [dispatch])

  const handleAdd = (cid, values) => {
    const data = {
      cid: uuidv4(),
      id: id,
      content: values.content,
      uid: currentUser.uid
    }
    socket.emit("add-comment", data);
  };

  const handleUpdate = (cid, values) => {
    const data = {
      cid: cid,
      id: id,
      content: values.content
    }
    socket.emit("update-comment", data);
  }

  const handleDelete = (cid) => {
    const data = {
      cid: cid,
      id: id,
    }
    socket.emit("delete-comment", data);
  };

  return (
  <div className='content-box'>
    <button onClick={() => setShowComments(!showComments)}>COMMENTS &#40;{number}&#41;</button>
    {showComments && <div>
      {comments.map(comment => (
          <Comment 
            key={comment.cid} 
            comment={comment} 
            handleDelete={handleDelete}
            handleUpdate={handleUpdate}
          />
        ))}
      {currentUser && <div className='content-box'>
        <div className='comment-box'>
          <CommentForm handleSubmit={handleAdd} content={""}/>
        </div>
      </div>}
    </div>
    }
  </div>
  );
};

export default CommentList;