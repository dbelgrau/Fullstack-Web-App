import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '../../slices/loginSlice';
import { selectFavoriteIds, addFavorite, removeFavorite, updateFavoriteRating } from '../../slices/favoriteSlice';
import axios from 'axios';
import { addLiked, removeLiked, selectLiked } from '../../slices/likedSlice';
import { updateMemeRating } from '../../slices/memeSlice';
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from "react-share";

const MemeReactions = ({ meme }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const isFavorite = useSelector(selectFavoriteIds)
    .find(id => id === meme.id) ? true : false;
  const isLiked = useSelector(selectLiked)
    .find(id => id === meme.id) ? true : false;

  const markSpam = async () => {
    try {
      await axios.post('http://localhost:8080/api/memes/spam',
        {id: meme.id});
    } catch (error) {
      console.log(error);
    }
  };

  const increaseRating = async() => {
    dispatch(addLiked(meme.id));
    dispatch(updateMemeRating({id:meme.id, rating: 1}));
    try {
      await axios.post('http://localhost:8080/api/memes/uprating', 
        {uid: currentUser.uid ,id: meme.id});
    } catch (error) {
      console.log(error);
    }
  };

  const decreaseRating = async() => {
    dispatch(removeLiked(meme.id));
    dispatch(updateMemeRating({id:meme.id, rating: -1}));
    try {
      await axios.post('http://localhost:8080/api/memes/downrating', 
        {uid: currentUser.uid ,id: meme.id});
    } catch (error) {
      console.log(error);
    }
  };

  const favorite = async () => {
    dispatch(addFavorite(meme.id));
    try {
      await axios.post('http://localhost:8080/api/memes/favorites', 
        {uid: currentUser.uid ,id: meme.id});
    } catch (error) {
      console.log(error);
    }
  };

  const notFavorite = async () => {
    dispatch(removeFavorite(meme.id));
    try {
      await axios.post('http://localhost:8080/api/memes/notfavorites', 
        {uid: currentUser.uid ,id: meme.id});
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='meme-buttons box-item'>
      <button onClick={markSpam}>SPAM</button>
      {!isLiked ? 
        <button onClick={increaseRating}>+{meme.rating.low}</button> :
        <button onClick={decreaseRating}>+{meme.rating.low}</button>}
      {!isFavorite ? 
        <button onClick={favorite}>FAVORITE</button> :
        <button onClick={notFavorite}>NOT FAVORITE</button>}
      <div className='shares'>
        <FacebookShareButton url={`http://localhost:3000/meme/${meme.id}`} quote={meme.title} hashtag={'#meme'}>
          <FacebookIcon size={32} />
        </FacebookShareButton>
        <WhatsappShareButton url={`http://localhost:3000/meme/${meme.id}`} title={meme.title}>
          <WhatsappIcon size={32} />
        </WhatsappShareButton>
        <TwitterShareButton url={`http://localhost:3000/meme/${meme.id}`}>
          <TwitterIcon size={32} />
        </TwitterShareButton>
      </div>
    </div>
  );
};

export default MemeReactions;