import { createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

const initialState = {
  ids: [],
  loading: false,
  error: null,
};

const likedSlice = createSlice({
  name: "liked",
  initialState,
  reducers: {
    addLiked(state, action) {
      state.ids.push(action.payload);
    },
    removeLiked(state, action) {
      const index = state.ids.findIndex((id) => id === action.payload);
      state.ids.splice(index, 1);
    },
    fetchLikedStart(state) {
      state.loading = true;
    },
    fetchLikedSuccess(state, action) {
      state.ids = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchLikedFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {  
  addLiked, 
  removeLiked, 
  fetchLikedStart,
  fetchLikedSuccess,
  fetchLikedFailed  
} = likedSlice.actions;

export const fetchLiked = (uid) => async (dispatch) => {
  try {
    dispatch(fetchLikedStart());
    const response = await axios.get(`http://localhost:8080/api/memes/liked/${uid}`);
    dispatch(fetchLikedSuccess(response.data));
  } catch (error) {
    dispatch(fetchLikedFailed(error.message));
  }
};

export const selectLiked = (state) => state.liked.ids;

export default likedSlice.reducer;