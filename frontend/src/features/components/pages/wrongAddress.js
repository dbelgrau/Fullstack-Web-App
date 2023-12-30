import React from 'react';

const WrongAddress = () => {
  return(
    <div className='content-box'>
      <h1 className='box-item'>404</h1>
      <h2 className='box-item'>Wrong address mothe...</h2>
      <img className='box-item' src='http://localhost:8080/api/images/taxi.jpg' alt='Lucky you...' />
      <img className='box-item' src='http://localhost:8080/api/images/taxi.gif' alt='Lucky you...' />
    </div>
  );
}

export default WrongAddress;