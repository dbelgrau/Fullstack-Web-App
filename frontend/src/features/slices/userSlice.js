import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  users: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser(state, action) {
      state.users.push(action.payload);
    },
    updateUser(state, action) {
      const index = state.users.findIndex((user) => user.uid === action.payload.uid);
      state.users[index] = action.payload;
    },
    changeUserRole(state, action) {
      const index = state.users.findIndex((user) => user.uid === action.payload.uid);
      state.users[index].role = action.payload.role;
    },
    removeUser(state, action) {
      const index = state.users.findIndex((user) => user.uid === action.payload);
      state.users.splice(index, 1);
    },
    fetchUsersStart(state) {
      state.loading = true;
    },
    fetchUsersSuccess(state, action) {
      state.users = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchUsersFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchUsersStart, 
  addUser,
  updateUser, 
  changeUserRole,
  removeUser,
  fetchUsersSuccess, 
  fetchUsersFailed, 
} = userSlice.actions;

export const fetchUsers = () => async (dispatch) => {
  try {
    dispatch(fetchUsersStart());
    const response = await axios.get('http://localhost:8080/api/users');
    dispatch(fetchUsersSuccess(response.data));
  } catch (error) {
    dispatch(fetchUsersFailed(error.message));
  }
};

export const selectUsers = (state, filter=null, sorting=null) => {
  let users = state.users.users;
  if (filter?.name) users = users.filter(u => {
    return u.name.toLowerCase().includes(filter.name.toLowerCase())
  });
  if (filter?.date) users = users.filter(u => {
    return new Date(u.created_at).toDateString() === new Date(filter.date).toDateString()
  });
  if (filter?.role) users = users.filter(u => {
    return u.role.toLowerCase().includes(filter.role.toLowerCase())
  });
  
  if (sorting?.date) users = users.slice().sort((u1, u2) => 
    sorting.date * (new Date(u2.created_at) - new Date(u1.created_at)));
  if (sorting?.name) users = users.slice().sort((u1, u2) => 
    sorting.name * ( u1.name.localeCompare(u2.name)));
  if (sorting?.role) users = users.slice().sort((u1, u2) => 
    sorting.role * ( u1.role.localeCompare(u2.role)));
  
  return users;
}

export default userSlice.reducer;