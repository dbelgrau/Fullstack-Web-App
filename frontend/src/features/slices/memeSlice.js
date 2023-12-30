import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  memes: [],
  loading: false,
  error: null,
};

const memeSlice = createSlice({
  name: 'memes',
  initialState,
  reducers: {
    addMeme(state, action) {
      state.memes.push(action.payload);
    },
    updateMeme(state, action) {
      const index = state.memes.findIndex((meme) => meme.id === action.payload.id);
      state.memes[index] = action.payload;
    },
    updateMemeRating(state, action) {
      const index = state.memes.findIndex((meme) => meme.id === action.payload.id);
      state.memes[index].rating.low += action.payload.rating;
    },
    removeMeme(state, action) {
      const index = state.memes.findIndex((meme) => meme.id === action.payload);
      state.memes.splice(index, 1);
    },
    removeAllUserMemes(state, action) {
      state.memes = state.memes.filter((meme) => meme.uid !== action.payload);
    },
    fetchMemesStart(state) {
      state.loading = true;
    },
    fetchMemesSuccess(state, action) {
      state.memes = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchMemesFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchMemesStart,
  addMeme,
  updateMeme,
  updateMemeRating,
  removeMeme, 
  removeAllUserMemes,
  fetchMemesSuccess, 
  fetchMemesFailed 
} = memeSlice.actions;

export const fetchMemes = () => async (dispatch) => {
  try {
    dispatch(fetchMemesStart());
    const response = await axios.get('http://localhost:8080/api/memes');
    dispatch(fetchMemesSuccess(response.data));
  } catch (error) {
    dispatch(fetchMemesFailed(error.message));
  }
};

export const selectMemes = (state, filter=null, sorting=null, category=null, uid=null, favorites=false) => {
  let memes = state.memes.memes;
  const favorite = state.favorite.ids;
  
  if (category) memes = memes.filter(m => m.category === category);
  if (uid) memes = memes.filter(m => m.uid === uid);
  if (favorites) memes = memes.filter(meme => favorite.includes(meme.id));
  
  if (filter?.title) memes = memes.filter(m => {
    return m.title.toLowerCase().includes(filter.title.toLowerCase())
  });
  if (filter?.date && !filter?.newer) memes = memes.filter(m => {
    return new Date(m.added_at).toDateString() === new Date(filter.date).toDateString()
  });
  if (filter?.newer && filter?.date) memes = memes.filter(m => {
    return new Date(m.added_at) >= new Date(filter.date)
  });
  
  if (sorting?.date) memes = memes.slice().sort((m1, m2) => 
    sorting.date * (new Date(m2.added_at) - new Date(m1.added_at)));
  if (sorting?.title) memes = memes.slice().sort((m1, m2) => 
    sorting.title * ( m1.title.localeCompare(m2.title)));
  if (sorting?.rating) memes = memes.slice().sort((m1, m2) => 
    sorting.rating * (m2.rating.low - m1.rating.low));
  
  return memes;
}

export default memeSlice.reducer;
