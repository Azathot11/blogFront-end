
  import React, { useState,useEffect } from "react";
  import { useParams } from "react-router-dom";
  import Button from "../../shared/components/FormElements/Button";
  import Input from "../../shared/components/FormElements/Input";
  import {
    VALIDATOR_REQUIRE,
    VALIDATOR_MINLENGTH,
  } from "../../shared/util/validators";
  import { useForm } from "../../shared/hooks/form-hook";
  import { useStateContext } from "../../shared/context/auth-context";
  import Card from "../../shared/components/UIElements/Card";
  import { useHttpClient } from "../../shared/hooks/http-hook";
  import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
  import ErrorModal from "../../shared/components/UIElements/ErrorModal";

  import { useNavigate } from "react-router-dom";


  
  const UpdatePlace = () => {
      
    const [loadedPlace, setLoadedPlace] = useState();
    const {token} = useStateContext();    
    const params = useParams().placeId;
    const navigate = useNavigate();
   const {error,loading,sendRequest,errorHandler } = useHttpClient();
    const [formState, inputHandler,setFormData] = useForm(
      {
        title: {
          value:'',
          isValid: false
        },
        description: {
          value: '',
          isValid: false
        },
        address: {
          value: '',
          isValid: true
        }
      },
      false
    );

    const requestData =(data)=>{
      console.log(data.place);
    }

    useEffect(()=>{
      const fetchHandler=async()=>{
        try{
          const response = await sendRequest(`http://localhost:8081/api/place/${params}`,requestData);
          console.log(response,'yes')
          setLoadedPlace(response.place);
           setFormData(
          {
            title: {
              value: response.place.title,
              isValid: true
            },
            description: {
              value: response.place.description,
              isValid: true
            }, address: {
              value: response.place.address,
              isValid: true
            }
          },
          true
        );
        }catch(err){}
      }

      fetchHandler()
    },[sendRequest,setFormData,params])
    
   
  
    const placeUpdateSubmitHandler = async(event) => {
      event.preventDefault();
      console.log(formState.inputs);
      const data ={
        title:formState.inputs.title.value,
        description:formState.inputs.description.value,
        address:formState.inputs.address.value,
      };

      const headers= {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      };

     

      try {
        sendRequest(`http://localhost:8081/api/place/${loadedPlace._id}`,requestData,'PATCH',data,headers);
        navigate('/user/places');
      } catch (err) {
        console.log(err)
      }
    };

    if(loading) {
      return (
        <div className="center">
          <LoadingSpinner />
        </div>
      );
    }

    if (!loadedPlace && !error) {
      return (
        <div className="center">
          <Card>
            <h2>Could not find place!</h2>
          </Card>
        </div>
      );
    }
  
    return (
      <>
       <ErrorModal error={error} onClear={errorHandler}/>
       {!loading && loadedPlace && (
      <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
        initialValue={loadedPlace.title}
        initialValid={true}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (min. 5 characters)."
        onInput={inputHandler}
        initialValue={loadedPlace.description}
        initialValid={true}
      />
          <Input
        id="address"
        element="input"
        label="Address"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid address."
        initialValue={loadedPlace.address}
        initialValid={true}
        onInput={inputHandler}
      />
        <Button type="submit" disabled={!formState.isValid}>
          UPDATE PLACE
        </Button>
      </form>
      )}
      </>
    );
  };
  
  export default UpdatePlace;
  