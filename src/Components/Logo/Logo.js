import React from 'react';
import Tilt from 'react-parallax-tilt';
import './Logo.css';
import fr from './fr.jpg';

const Logo = () => {
	return (
		<div className='ma4 mt0'>
		<Tilt className='Tilt br2 shadow-2'>
      <div className='Tilt-inner pa3'style={{ height: '120px', width:'123px' }}>
        <img style={{paddingLeft:'0px'}} src={fr} alt='Logo' />
      </div>
    </Tilt>
		</div>
		)

}

export default Logo;