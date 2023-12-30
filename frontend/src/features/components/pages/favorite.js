import React, { useEffect } from 'react';
import MemeList from '../memes/memeList';

const Favorite = () => {

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className='main'>
      <MemeList favorites={true}/>
    </div>
  );
}

export default Favorite;
