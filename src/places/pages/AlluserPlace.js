import React, { useState,useEffect } from "react";
import AllPlaceList from "../components/AllPlaceList";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";

import { useParams } from "react-router-dom";
import axios from "axios";

const AlluserPlace = () => {
    const [items, setItems] = useState([]);
    const params = useParams().uid;
  

    const requestData=(data)=>{
      setItems(data.place);
    };

    const {error, loading,sendRequest,errorHandler} = useHttpClient();

    useEffect(()=>{
      sendRequest(`http://localhost:8081/api/user/${params}`,requestData)
    },[sendRequest])
  return (<>
    <ErrorModal error={error} onClear={errorHandler} />
    { loading &&<div className="center"> <LoadingSpinner /></div> }
  { !loading && items && <AllPlaceList items={items} />}
    </>
  )
}

export default AlluserPlace