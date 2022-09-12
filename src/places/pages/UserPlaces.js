import React, { useState,useEffect } from "react";
import PlaceList from "../components/PlaceList";
import { useStateContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";

const UserPlaces = () => {
  const [items, setItems] = useState([]);
  const {token}= useStateContext();

  const requestData = (data)=>{
    setItems(data.place);
  };

  const {error,loading,sendRequest,errorHandler } = useHttpClient();
  
  useEffect(()=>{
    const  headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    }
    sendRequest('http://localhost:8081/api/userplaces',requestData,'GET',{},headers);
  },[sendRequest])
  
  const placeDeletedHandler=(deletedPlaceId)=>{
     setItems(prevPlaces=> prevPlaces.filter(place=>place._id !== deletedPlaceId))
  }
 
  return (
    <>
     <ErrorModal error={error} onClear={errorHandler}/>
    { loading &&<div className="center"> <LoadingSpinner /></div> }
  { !loading && items && <PlaceList items={items} onDeletePlace={placeDeletedHandler}/>}
    </>
  )
};

export default UserPlaces;
