import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Meme from '../memes/meme';

const Spam = () => {
  const [memes, setMemes] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchMemes();
  }, []);

  const fetchMemes = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/memes/spam`);
      setMemes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='main'>
      <div className='meme-list'>
        {memes.map(meme => (
          <Meme key={meme.id} meme={meme} />
        ))}
      </div>

    </div>
  );
}

export default Spam;