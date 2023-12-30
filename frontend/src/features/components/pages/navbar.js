import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout, selectCurrentUser, setCurrentUser } from '../../slices/loginSlice';
import { fetchUsers } from '../../slices/userSlice';
import { fetchMemes } from '../../slices/memeSlice';
import axios from 'axios';
import { fetchFavorite } from '../../slices/favoriteSlice';
import { fetchLiked } from '../../slices/likedSlice';
import UserPanel from '../users/userPanel';

const Navbar = () => {

  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const verify = async () => {
      try {
        if (!currentUser) {
          const res = await axios
            .post("http://localhost:8080/api/users/verify",{},{withCredentials: true});
          if (res.data.user) {
            dispatch(setCurrentUser(res.data.user));
            dispatch(fetchFavorite(res.data.user.uid));
            dispatch(fetchLiked(res.data.user.uid));
          } else {
            navigate("/login");
          }
        }
        else {
          dispatch(fetchFavorite(currentUser.uid));
          dispatch(fetchLiked(currentUser.uid));
        }
      } catch (error) {
        navigate("/login");
        console.log(error);
      }
    };
    verify();
  },[currentUser]);

  useEffect(() => {
    axios.get('https://api.open-meteo.com/v1/forecast?latitude=54.39&longitude=18.59&current_weather=true')
    .then(res => setWeather(res.data.current_weather));
    dispatch(fetchMemes());
    dispatch(fetchUsers());
  },[]);

  const handleLogout = async () =>{
    await axios.post('http://localhost:8080/api/users/logout',
      {}, {withCredentials: true});
    dispatch(logout());
    navigate('/login');
  }
  //console.log(weather);

  return (
    <div className='navbar'>
      <Link to={'/'}>MAIN PAGE</Link>
      <Link to={'/ranking'}>RANKING</Link>
      <Link to={'/favorite'}>FAVORITES</Link>
      {(currentUser && currentUser.role === 'admin' ) && 
        <Link to={'/admin'}>ADMIN PANEL</Link>
      }
      {(currentUser && weather)  && <UserPanel 
        currentUser={currentUser}
        weather={weather}
        handleLogout={handleLogout}
      />}
    </div>
  );
};

export default Navbar;