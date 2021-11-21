import React from 'react';
import './Navigation.css';

const Navigation = ({ onRouteChange, isSignedIn }) => {
    if (isSignedIn) {
      return (
        <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
          <p onClick={() => onRouteChange('signout')} className='f3 b link dim white  pa3 pointer hover-effect'>Sign Out</p>
        </nav>
      );
    } else {
      return (
        <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
          <p onClick={() => onRouteChange('signin')} className='f4 b link dim black  pa3 pointer'>Sign In</p>
          <p onClick={() => onRouteChange('register')} className='f4 b link dim black  pa3 pointer'>Register</p>
        </nav>
      );
    }
}

export default Navigation;