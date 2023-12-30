import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectMemes } from '../../slices/memeSlice';
import Meme from './meme';
import SortFilt from './sortFilt';

const MemeList = ({ category, changable = true, uid, favorites }) => {
  const [sort, setSort] = useState({date: 1});
  const [filt, setFilt] = useState({});
  
  const memes = useSelector(state => 
    selectMemes(state, filt, sort, category, uid, favorites));
  const users = useSelector(state => state.users.users);

  return (
    <div className='meme-list'>
      {!users || !users.length || users.loading ? 
        <p>Loading...</p> : 
        <div>
          {changable && <SortFilt setSort={setSort} filt={filt} setFilt={setFilt}/> }
          {memes.map(meme => (
            <Meme key={meme.id} meme={meme}/>
          ))}
        </div>
      }
    </div>
  );
}

export default MemeList;
