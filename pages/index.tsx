import type { NextPage } from 'next'
import { useEffect, useState } from 'react';

import { Login } from "../containers/Login";
import Home from './home';

const Index: NextPage = () => {

  const [accessToken, setAccessToken] = useState("");
  useEffect(() => {
    if(typeof window != undefined) {
      const accessToken = localStorage.getItem("accessToken");
      if(accessToken) {
        setAccessToken(accessToken);
      }
    }
  }, []);

  return (
    <>
      { accessToken ? <Home /> : <Login setAccessToken={setAccessToken} />}
    </>
  )
}

export default Index


