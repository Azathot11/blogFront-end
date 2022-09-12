import React, { useState, useEffect } from "react";
import UsersList from "../components/UsersList";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";


const User = () => {
  const [items, setItems] = useState([]);
  // const [loading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);

  const requestData=(data)=>{
    setItems(data.users);
  }

  const {error, loading,sendRequest,errorHandler} = useHttpClient();

  // useEffect(() => {
  //   setIsLoading(true);
  //   axios
  //     .get("http://localhost:8081/user/getUsers")
  //     .then((res) => {
  //       if (res.status === 200) {
  //         setIsLoading(false);
  //         setItems(res.data.users);
  //       }
  //       if (!res.ok) {
  //         throw new Error(res.data.messge);
  //       }
  //       // console.log(res.data.users);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       setIsLoading(false);
  //       setError(err.message);
  //     });
  // }, []);

  // const errorHandler = () => {
  //   setError(null);
  // };
useEffect(()=>{
  sendRequest('http://localhost:8081/user/getUsers',requestData)
},[sendRequest])

  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
      {loading && items && (
        <div className="center">
          <LoadingSpinner  />
        </div>
      )}
    { !loading && items && <UsersList items={items} />}
      
    </>
  );
};

export default User;
