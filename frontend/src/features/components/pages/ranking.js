import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Meme from '../memes/meme';

const Ranking = () => {
  const [sortBy, setSortBy] = useState('rating');
  const [memes, setMemes] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchMemes();
  }, [sortBy]);

  const fetchMemes = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/memes/ranking/${sortBy}`);
      setMemes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='main'>
      <div className='content-box'>
        <div className='meme-buttons flex-row'>
          <button onClick={() => setSortBy('rating')}>RATING</button>
          <button onClick={() => setSortBy('comments')}>COMMENTS</button>
          <button onClick={() => setSortBy('favorites')}>FAVORITES</button>
        </div>
      </div>
      <div className='meme-list'>
        {memes.map(meme => (
          <Meme key={meme.id} meme={meme} />
        ))}
      </div>

    </div>
  );
}

export default Ranking;
