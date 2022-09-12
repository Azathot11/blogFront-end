import  { useState,useCallback ,useRef,useEffect} from "react";
import axios from "axios";

export const useHttpClient = () => {
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const activehttpRequests = useRef([]);

  const sendRequest = useCallback(async(url, requestData,method = "GET",data={},  headers = {"Content-Type":"application/json","Accept":"application/json"}) => {
    setIsLoading(true);
    const httpAbortCtrll = new AbortController();
    activehttpRequests.current.push(httpAbortCtrll);

    try {

      const response = await axios({
        method,
        url,
        data,
        headers: headers,
        signal: httpAbortCtrll.signal,
      });
      // console.log(response)

      activehttpRequests.current = activehttpRequests.current.filter(
        (reqCtrl) => reqCtrl !== httpAbortCtrll
      );


      if (response.status === 200 || response.status === 201) {
        setIsLoading(false);
        requestData(response.data);
        const fetchedData= response.data
        return fetchedData
      }
      
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      if(err.response){
        setError(err.response.data.message);
      }
      
      throw err;
    }

  },[]);
  const errorHandler=()=>{
    setError(null);
  }

  useEffect(()=>{
    return ()=>{
        activehttpRequests.current.forEach(abortCtrl=>abortCtrl.abort())
    }
  },[])

  return {
    error,
    loading,
    sendRequest,
    errorHandler
  }
};
