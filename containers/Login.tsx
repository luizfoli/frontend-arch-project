import { NextPage } from "next";
import { useState } from "react";
import {executeRequest}  from "../services/api";
import { LoginResponse } from "../types/responses/LoginResponse";

type LoginProps = {
    setAccessToken(accessToken: string) : void
};

export const Login: NextPage<LoginProps> = (LoginProps) => {

    const [name, setName] = useState("");
    const [login , setLogin] = useState("");
    const [password , setPassword] = useState("");

    const [loginPage, setLoginPage] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    const doAction = async() => {

        if(loginPage) {
            await doLogin();
            return;
        }

        doSignUp();
    };

    const doLogin = async () => {
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
    }

    const doSignUp = () => {
        try {

            if(!name || !login || !password) {
                setErrorMsg("Favor preencher os campos nome, login e senha");
                return;
            } 


        } catch(error) {
            if(error?.response?.data?.error) {
                setErrorMsg(error.response.data.error);
                return;
            }
            const errorMsg = "Ocorreu um erro ao efetuar o cadastro tente novamente"; 
            setErrorMsg(errorMsg);
            console.log({error: errorMsg})
        }
    }

    return (
        <div className="container-login">
            <img className="logo" src="/logo.svg" alt="Logo FIAP" />

                <div className="form">
                            {errorMsg && <p>{errorMsg}</p>}
                            { !loginPage && 
                                <div className="input">
                                    <img className="user-logo" src="/profile.svg" alt="Informe seu nome" />
                                    <input type="text" placeholder="Informe seu nome" 
                                        value={name} onChange={val => setName(val.target.value)}/>
                                </div>
                            }
                            <div className="input">
                                <img src="/mail.svg" alt="Informe seu e-mail" />
                                <input type="text" placeholder="Informe seu e-mail" 
                                    value={login} onChange={val => setLogin(val.target.value)} />
                            </div>
                            <div className="input">
                                <img src="/lock.svg" alt="Informe sua senha" />
                                <input type="password" placeholder="Informe sua senha"
                                    value={password}  onChange={val => setPassword(val.target.value)} />
                            </div>
                            <button onClick={doAction}>
                                {loginPage ? "Login" : "Inscrever-se" }
                            </button>
                    <div className="sign-up" onClick={() => setLoginPage(!loginPage)}>
                        { loginPage ? <p>Ainda não possui um cadastro?<br/>Clique aqui para se inscrever</p>
                        : <p>Já possui cadastro? <br/> Clique aqui para logar</p> }
                    </div>
                </div>
        </div>
    );
}