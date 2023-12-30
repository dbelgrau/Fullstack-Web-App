import React from 'react';
import { Link } from 'react-router-dom';

const Author = ({ user }) => {
  return (
    <div>
      <Link to={`/user/${user.id}`}>
        <img src={user.icon} alt={user.name} />
        <h4>{user.name}</h4>
      </Link>
    </div>
  );
};

export default Author;