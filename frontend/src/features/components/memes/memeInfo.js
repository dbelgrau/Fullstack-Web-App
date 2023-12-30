import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Meme from './meme';
import { selectCurrentUser } from '../../slices/loginSlice';
import ModifyMeme from './modifyMeme';
import DeleteMeme from './deleteMeme';
import CommentList from '../comments/commentsList';

const MemeInfo = () => {
  const { id } = useParams();
  const currentUser = useSelector(selectCurrentUser);
  const meme = useSelector(state => 
    state.memes.memes.find(m => m.id === id));

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  return (
    <div className='main'>
      {(meme && currentUser) ?
        <div>
          <Meme meme={meme} />
          {(currentUser.role === 'admin' || currentUser.uid === meme.uid) &&
          <div>
            <div className='content-box'>
            {currentUser?.role !== 'banned' ?
              <button onClick={() => setIsEditing(!isEditing)}>EDIT MEME</button> :
              <h2 className='box-item'>USER BANNED</h2>
            }
              </div>
            {isEditing &&
              <>
                <ModifyMeme meme={meme} />
                <DeleteMeme id={meme.id} />
              </>
            }
          </div>}
          <CommentList id={meme.id} number={meme.comments}/>
        </div> :
        <div>Loading...</div>
    }
    </div>
  );
};

export default MemeInfo;