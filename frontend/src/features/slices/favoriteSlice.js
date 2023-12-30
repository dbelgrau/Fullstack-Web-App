import { createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

const initialState = {
  ids: [],
  loading: false,
  error: null,
};

const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    addFavorite(state, action) {
      state.ids.push(action.payload);
    },
    removeFavorite(state, action) {
      const index = state.ids.findIndex((id) => id === action.payload);
      state.ids.splice(index, 1);
    },
    fetchMemesStart(state) {
      state.loading = true;
    },
    fetchMemesSuccess(state, action) {
      state.ids = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchMemesFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { getFavorites, 
  addFavorite, 
  updateFavorite,
  updateFavoriteRating, 
  removeFavorite, 
  fetchMemesStart,
  fetchMemesSuccess,
  fetchMemesFailed  
} = favoriteSlice.actions;

export const fetchFavorite = (uid) => async (dispatch) => {
  try {
    dispatch(fetchMemesStart());
    const response = await axios.get(`http://localhost:8080/api/memes/favorites/${uid}`);
    dispatch(fetchMemesSuccess(response.data));
  } catch (error) {
    dispatch(fetchMemesFailed(error.message));
  }
};

export const selectFavoriteIds = (state) => state.favorite.ids;

export default favoriteSlice.reducer;