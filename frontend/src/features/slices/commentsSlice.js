import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  comments: [],
  loading: false,
  error: null,
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    addComment(state, action) {
      state.comments.push(action.payload);
    },
    updateComment(state, action) {
      const index = state.comments.findIndex((comment) => comment.cid === action.payload.cid);
      state.comments[index].content = action.payload.content;
      },
    removeComment(state, action) {
      const index = state.comments.findIndex((comment) => comment.cid === action.payload.cid);
      state.comments.splice(index, 1);
    },
    removeAllUserComments(state, action) {
      state.comments = state.comments.filter((comment) => comment.uid !== action.payload);
    },
    fetchCommentsStart(state) {
      state.loading = true;
    },
    fetchCommentsSuccess(state, action) {
      state.comments = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchCommentsFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { 
  addComment, 
  updateComment,
  removeComment,
  removeAllUserComments,
  fetchCommentsStart, 
  fetchCommentsSuccess, 
  fetchCommentsFailed 
} = commentsSlice.actions;

export const fetchComments = (id) => async (dispatch) => {
  try {
    dispatch(fetchCommentsStart());
    const response = await axios.get(`http://localhost:8080/api/comments/${id}`);
    dispatch(fetchCommentsSuccess(response.data));
  } catch (error) {
    dispatch(fetchCommentsFailed(error.message));
  }
};

export const selectComments = (state) => {
  return state.comments.comments.slice().sort((m1, m2) => 
    (new Date(m1.added_at) - new Date(m2.added_at)));;
}

export default commentsSlice.reducer;
