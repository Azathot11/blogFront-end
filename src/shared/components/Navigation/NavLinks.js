import React from 'react';
import { NavLink } from "react-router-dom";
import { useStateContext } from '../../context/auth-context';

import './NavLinks.css'

const NavLinks = () => {
  const {isLoggedIn,logout} = useStateContext();
  console.log(isLoggedIn)
  return (
    <ul className='nav-links'>
        <li><NavLink to='/'>ALL USERS</NavLink></li>
        {isLoggedIn && <li><NavLink to='/user/places'>MY PLACES</NavLink></li>}
        {isLoggedIn && <li><NavLink to='/places/new'>ADD PLACE</NavLink></li>}
       {isLoggedIn?<li className='logOut' onClick={()=>{logout()}}><button>LOGOUT</button></li>: <li><NavLink to='/auth'>AUTHENTICATE</NavLink></li>}
    </ul>
  )
}

export default NavLinks