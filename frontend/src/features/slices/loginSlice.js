import { createSlice } from '@reduxjs/toolkit';
const initialState = { currentUser: null };

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
    },
    logout(state) {
      state.currentUser = null;
    }
  }
});

export const { setCurrentUser, logout } = loginSlice.actions;

export const selectCurrentUser = state => state.login.currentUser;

export default loginSlice.reducer;