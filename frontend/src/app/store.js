import { configureStore } from '@reduxjs/toolkit';
//import logger from 'redux-logger';
import memesReducer from '../features/slices/memeSlice';
import userReducer from '../features/slices/userSlice';
import loginReducer from '../features/slices/loginSlice';
import favoriteReducer from '../features/slices/favoriteSlice';
import likedReducer from '../features/slices/likedSlice';
import commentsReducer from '../features/slices/commentsSlice';

export const store = configureStore({
  reducer: {
    memes: memesReducer,
    comments: commentsReducer,
    users: userReducer,
    login: loginReducer,
    favorite: favoriteReducer,
    liked: likedReducer
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});