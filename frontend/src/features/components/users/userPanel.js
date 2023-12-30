import React from 'react';
import { Link } from 'react-router-dom';

const UserPanel = ({currentUser, weather, handleLogout}) => {

  return (
    <div className='navbar-panel'>
      <div className='weather'>
        <div>Temperature: {weather.temperature}℃</div>
        <div>Wind: {weather.windspeed} km/h</div>
      </div>
      <div className='author-box'>
        <img className='user-icon' src={currentUser.image} alt={currentUser.name} />
        <Link to={`/user/${currentUser.uid}`}>{currentUser.name}</Link>
      </div>
      <button onClick={handleLogout} >SIGN OUT</button>
    </div>
  );
};

export default UserPanel;