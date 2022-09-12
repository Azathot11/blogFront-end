import React from 'react';
import {Routes,Route,Navigate} from 'react-router-dom'
import NewPlace from './places/pages/NewPlace';
import User from './user/pages/User';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';
import AlluserPlace from './places/pages/AlluserPlace';
import { useStateContext } from './shared/context/auth-context';
function App() {
  const {isLoggedIn} = useStateContext();
  let route
  if(!isLoggedIn){
    route = <Routes>
    <Route path='/' element={<User/>}/>
    <Route path='auth' element={<Auth/>}/>
    <Route path='/user/:uid' element={<AlluserPlace/>}/>
    {/* <Route path='/:userId/places' element={<UserPlaces/>}/>
    <Route path='/places/new' element={<NewPlace/>}/>
    <Route path='/places/:placeId' element={<UpdatePlace/>}/> */}
    <Route path='*' element={<Navigate to='/' replace/>}/>
  </Routes>
  }

  if(isLoggedIn){
  route = <Routes>
      <Route path='/' element={<User/>}/>
      {/* <Route path='auth' element={<Auth/>}/> */}
      <Route path='/user/:uid' element={<AlluserPlace/>}/>
      <Route path='/user/places' element={<UserPlaces/>}/>
      <Route path='/places/new' element={<NewPlace/>}/>
      <Route path='/places/:placeId' element={<UpdatePlace/>}/>
      <Route path='*' element={<Navigate to='/' replace/>}/>
  </Routes>
  }
  return (
    <>
    <MainNavigation/>
      <main>
       { route}
      </main>
    </>
  );
}

export default App;
