import React,{useState} from "react";
import Input from "../../shared/components/FormElements/Input";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import { useStateContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import { useNavigate } from "react-router-dom";

import "./NewPlace.css";


const NewPlace = () => {
  const {token} = useStateContext();
  const navigate = useNavigate();
  const [successMessage,setSucessMessage] = useState(null)
  // const [loading,setIsLoading] = useState(false);
  const [formState,inputHandler] =useForm( {
    title: {
      value: '',
      isValid: false
    },
    description: {
      value: '',
      isValid: false
    },
    address: {
      value: '',
      isValid: false
    },
    image:{
      value:null,
      isValid: false
    }
  },false);

  const requestData = (data)=>{
    console.log(data)
    if(data){
      setSucessMessage('You sucessfully created a new place ')
      navigate('/user/places')
    }
  };

  const {error,loading,sendRequest,errorHandler } = useHttpClient();
  
  const placeSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs);
    // const data={
    //   title:formState.inputs.title.value,
    //   description:formState.inputs.description.value,
    //   address:formState.inputs.address.value,
    // }
    const formData = new FormData();
    formData.append('image',formState.inputs.image.value);
    formData.append('title',formState.inputs.title.value);
    formData.append('description',formState.inputs.description.value);
    formData.append('address',formState.inputs.address.value);
    const  headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    }
    sendRequest('http://localhost:8081/api/createPlace',requestData,'POST',formData,headers)
    // setIsLoading(true);
    // axios.post('http://localhost:8081/api/createPlace',
    // {
    //   title:formState.inputs.title.value,
    //   description:formState.inputs.description.value,
    //   address:formState.inputs.address.value,
    // },
    // {
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: "Bearer " + token,
    //   }
    // }
    // ).then(res=>{
    //   if(res.status === 201){
    //     console.log(res.data)
    //     setIsLoading(false);
    //   }
    // }).catch(err=>{
    //   setIsLoading(false)
    //   console.log(err);
    // })
  };
  return (
    <>
    <ErrorModal error={error} onClear={errorHandler}/>
     {loading && <LoadingSpinner asOverlay/>}
    <form className="place-form" onSubmit={placeSubmitHandler}>
      <ImageUpload center id='image' onInput={inputHandler} errorText ='Please add an image'/>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (at least 5 characters)."
        onInput={inputHandler}
      />
      <Input
        id="address"
        element="input"
        label="Address"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid address."
        onInput={inputHandler}
      />
      {successMessage && <p className='signpmessage'>{successMessage}</p>}
      <Button type="submit" disabled={!formState.isValid}>
       {loading ?'Loading...' :'ADD PLACE'}
      </Button>
    </form>
    </>
  );
};

export default NewPlace;