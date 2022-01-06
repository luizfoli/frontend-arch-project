import { NextPage } from "next";
import { useEffect, useState } from "react";
import { Filter } from "../components/Filter";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { List } from "../components/List";
import { executeRequest } from "../services/api";

import {Modal} from 'react-bootstrap';
import { CrudModal } from "../components/Modal";
import { Task } from "../types/Task";

type HomeProps = {
    setToken(s: string) : void
}

export const Home : NextPage<HomeProps> = ({setToken}) => {

    // State filters
    const [previsionDateStart, setPrevisionDateStart] = useState('');
    const [previsionDateEnd, setPrevisionDateEnd] = useState('');
    const [status, setStatus] = useState('0');
    const [tasks, setTasks] = useState<Task[]>([]);

    // State Modal
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [name, setName] = useState("");
    const [previsionDate, setPrevisionDate] = useState("");

    const closeModal = () => {
        setShowModal(false);
        setPrevisionDate("");
        setName("");
    }

    const doSave = async () => {
        if(!name || !previsionDate) {
            setErrorMessage("Favor preencher nome e data de previsão");
            return;
        }

        const body = {
            name,
            previsionDate
        }

        await executeRequest('task', 'POST', body);
        closeModal();
        getFilteredList();
    }

    const sair = () =>{
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        setToken('');
    }

    const getFilteredList = async () => {
        try{
            let filter = '?status='+status;
            if(previsionDateStart){
                filter += '&previsionDateStart='+previsionDateStart;
            }

            if(previsionDateEnd){
                filter += '&previsionDateEnd='+previsionDateEnd;
            }

            const result = await executeRequest('task'+filter, 'GET');
            if(result && result.data){
                setTasks(result.data as Task[]);
            }
        }catch(e){
            console.log(e);
        }
    }

    useEffect(() => {
        getFilteredList();
    }, [status, previsionDateStart,]);




    return (
    <>
        <Header sair={sair} showModal={() => setShowModal(true)}/>
        <Filter 
            previsionDateStart={previsionDateStart}
            previsionDateEnd={previsionDateEnd}
            status={status}
            setPrevisionDateStart={setPrevisionDateStart}
            setPrevisionDateEnd={setPrevisionDateEnd}
            setStatus={setStatus}
        />
        <List tasks={tasks} getFilteredList={getFilteredList}/>
        <Footer showModal={() => setShowModal(true)} />
        <CrudModal 
            showModal={showModal} 
            name={name}
            setName={setName}
            previsionDate={previsionDate}
            setPrevisionDate={setPrevisionDate}
            errorMessage={errorMessage} 
            doSave={doSave}
            closeModal={closeModal}
        />
    </>);
}