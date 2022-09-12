import React,{useState,useEffect} from 'react';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'  
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH,VALIDATOR_REQUIRE} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import Card from '../../shared/components/UIElements/Card';
import { useStateContext } from '../../shared/context/auth-context';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {BsEye} from 'react-icons/bs';

import './Auth.css'


const Auth = () => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [equalPassword,setEqualPassword] = useState(false);
    const [passType,setPassType] = useState(false);
    const [loading,setIsLoading] = useState(false);
    const [signupMessage,setSigUpmessage] = useState(false);
    const [errorMessage,setErrorMessage] = useState(null);
    const {token,login} = useStateContext();
    const navigate = useNavigate();

    const changePassTypeHandler=()=>{
      setPassType(!passType)
    }
  
    const [formState, inputHandler, setFormData] = useForm(
      {
        email: {
          value: '',
          isValid: false
        },
        password: {
          value: '',
          isValid: false
        }
      },
      false
    );
  
    const switchModeHandler = () => {
      if (!isLoginMode) {
        setFormData(
          {
            ...formState.inputs,
            name: undefined
          },
          formState.inputs.email.isValid && formState.inputs.password.isValid
        );
      } else {
        setFormData(
          {
            ...formState.inputs,
            name: {
              value: '',
              isValid: false
            }
          },
          false
        );
      }
      setIsLoginMode(prevMode => !prevMode);
    };
   

    const authSubmitHandler = event => {
      event.preventDefault();
      console.log(formState.inputs);
      const url = isLoginMode ?'http://localhost:8081/auth/signIn':'http://localhost:8081/user/signUp'
      if(!isLoginMode){
        if(formState.inputs.password.value !== formState.inputs.confirmPassword.value ){
          setEqualPassword(true);
         return
        }
      }
       const postData =isLoginMode ? {
        email:formState.inputs.email.value,
        password:formState.inputs.password.value
      }:{
        name:formState.inputs.name.value,
        email:formState.inputs.email.value,
        password:formState.inputs.password.value,
        confirmPassword:formState.inputs.confirmPassword.value
      }
      setIsLoading(true);
      // console.log(postData)
      
      axios.post(url,postData)
      .then((data)=>{
        console.log(data)
        if(data.status === 200){
          const remainingMilliseconds = 60 * 60 * 1000;
        const expirationTime = new Date(
          new Date().getTime() + +remainingMilliseconds
        );
       login(data.data.token, expirationTime.toISOString());
       navigate('/',{replace:true})
        }

        if(data.status === 201){
          setIsLoading(false);
          setSigUpmessage(true);
          setIsLoginMode(true)
        }
        console.log(data.status)
      }).catch(err=>{
        console.log(err.response.status);
        setIsLoading(false);
        if(err.response.status === 401 && isLoginMode){
           setErrorMessage('Wrong email or password ');
        }
        if(err.response.status === 404 && isLoginMode){
           setErrorMessage('User does not exist. Create an account');
        }
        if(err.response.status === 422 && !isLoginMode){
           setErrorMessage('User already exist. Please login ');
        }
        if(err.response.status === 500){
           setErrorMessage('An error occured please try again')
        }
      })
    };
    

    const errorHandler =()=>{
      setErrorMessage(null)
    }
  
    return (
      <>
      <ErrorModal error={errorMessage} onClear={errorHandler}/>
      <Card className="authentication">
        {loading && <LoadingSpinner asOverlay/>}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
            />
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <div className='inputob'>
            <Input
              element="input"
              id="password"
              type={!passType?"password":'text'}
              label="Password"
              validators={[VALIDATOR_MINLENGTH(5)]}
              errorText="Please enter a valid password, at least 5 characters."
              onInput={inputHandler}
            />
            <BsEye className='eyeIcon' onClick={changePassTypeHandler}/>
          </div>
         
         {!isLoginMode &&  <div className='inputob'><Input
            element="input"
            id="confirmPassword"
            type={!passType?"password":'text'}
            label="Confirm password"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid password, at least 5 characters."
            onInput={inputHandler}
          />
          <BsEye className='eyeIcon' onClick={changePassTypeHandler}/>
          </div>
          }
         {!isLoginMode && <p className='equalPassword'>{equalPassword && 'Passwords are not equal'}</p>}
         {signupMessage && <p className='signpmessage'>Your account was created with success now login</p>}
         {errorMessage !== '' && <p  className='equalPassword'>{errorMessage}</p>}
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP' } 
          </Button>
        </form>
        <div  className='switchB' onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
        </div>
      </Card>
      </>
    );
  };
  
  export default Auth;
  