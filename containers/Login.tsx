import { NextPage } from "next";
import { useState } from "react";
import {executeRequest}  from "../services/api";
import { LoginResponse } from "../types/responses/LoginResponse";

type LoginProps = {
    setAccessToken(accessToken: string) : void
};

export const Login: NextPage<LoginProps> = (LoginProps) => {

    const [login , setLogin] = useState("");
    const [password , setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const doLogin = async() => {

        try {
            if(!login || !password) {
                setErrorMsg("Favor preencher os campos login e senha");
                return;
            } 

            setErrorMsg("");

            const body = {
                username: login,
                password
            };
            
            const response = await executeRequest("login", "POST", body);
            if(response && response.data) {
                const loginResponse = response.data as LoginResponse;
                localStorage.setItem("email", loginResponse.email);
                localStorage.setItem("name", loginResponse.name);
                localStorage.setItem("accessToken", loginResponse.token);
                LoginProps.setAccessToken(loginResponse.token);
            }

        } catch(error) {
            if(error?.response?.data?.error) {
                setErrorMsg(error.response.data.error);
                return;
            }
            const errorMsg = "Ocorreu um erro ao efetuar o login tente novamente"; 
            setErrorMsg(errorMsg);
            console.log({error: errorMsg})
        }
    };


    return (
        <div className="container-login">
            <img className="logo" src="/logo.svg" alt="Logo FIAP" />
            <div className="form">
                {errorMsg && <p>{errorMsg}</p>}
                <div className="input">
                    <img src="/mail.svg" alt="Informe seu email" />
                    <input type="text" placeholder="Informe seu email" 
                        value={login} onChange={val => setLogin(val.target.value)} />
                </div>
                <div className="input">
                <img src="/lock.svg" alt="Informe sua senha" />
                    <input type="password" placeholder="Informe sua senha"
                        value={password}  onChange={val => setPassword(val.target.value)} />
                </div>
                <button onClick={doLogin} >Login</button>
            </div>
        </div>
    );
}