import React, { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../slices/loginSlice';
import AddMeme from '../memes/addMeme';
import MemeList from '../memes/memeList';

const MainPage = () => {
  const currentUser = useSelector(selectCurrentUser);

  const [showAddMeme, setShowAddMeme] = useState(false);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className='main'>
      <div className='content-box'>
        <div className='category'>
          <button className={category === null ? 'active' : ''} 
            onClick={() => setCategory(null)}>ALL</button>
          <button className={category === 'humor' ? 'active' : ''} 
            onClick={() => setCategory('humor')}>HUMOR</button>
          <button className={category === 'political' ? 'active' : ''} 
            onClick={() => setCategory('political')}>POLITICAL</button>
          <button className={category === 'sports' ? 'active' : ''} 
            onClick={() => setCategory('sports')}>SPORTS</button>
          <button className={category === 'thoughts' ? 'active' : ''} 
            onClick={() => setCategory('thoughts')}>THOUGHTS</button>
          <button className={category === 'nsfw' ? 'active' : ''} 
            onClick={() => setCategory('nsfw')}>NSFW
          </button>
        </div>
      </div>
      <div className='content-box'>
        {currentUser?.role !== 'banned' ? 
        <button onClick={() => setShowAddMeme(!showAddMeme)}>ADD MEME</button> : 
        <h2 className='box-item'>USER BANNED</h2>
        }
      </div>
      {showAddMeme && <AddMeme />}
      <MemeList category={category} changable={true}/>
    </div>
  );
}

export default MainPage;
