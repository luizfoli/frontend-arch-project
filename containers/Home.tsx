import { NextPage } from "next";
import { useEffect, useState } from "react";
import { Filter } from "../components/Filter";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { List } from "../components/List";
import { Task } from "../models/Task";
import { executeRequest } from "../services/api";

import {Modal} from 'react-bootstrap';
import { CrudModal } from "../components/Modal";

type HomeProps = {
    setToken(s: string) : void
}

export const Home : NextPage<HomeProps> = ({setToken}) => {

    // State filters
    const [previsionDateStart, setPrevisionDateStart] = useState('');
    const [previsionDateEnd, setPrevisionDateEnd] = useState('');
    const [status, setStatus] = useState(0);
    const [tasks, setTasks] = useState([]);

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

    const getFilteredList =  async () => {
        try {
            let filter = `?status=${status}`;

            if(previsionDateStart) {
                filter+=`&previsionDate=${previsionDateStart}`
            }

            if(previsionDateEnd) {
                filter+=`&previsionDateEnd=${previsionDateEnd}`
            }

            const result = await executeRequest('task'+filter, 'GET');
            console.log(result)
            if(result && result.data && result.data.result) {
                setTasks(result.data.result);
            }

        } catch(e) {
            console.error(e);
        }
        // console.log(previsionDateStart)
        // setTasks([{
        //     "_id": "61a6b18c6f88be8991968e24",
        //     "userId": "61a3cae902c7535d48dc4b2f",
        //     "name": "Task 1 Alterada",
        //     "previsionDate": "2021-12-01T00:00:00.000Z",
        //     "__v": 0,
        //     "finishDate": "2021-12-02T00:00:00.000Z"
        //   },])
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
        <List tasks={tasks} />
        <Footer showModal={() => setShowModal(true)} />
        <CrudModal 
            showModal={showModal} 
            name={name}
            setName={setName}
            previsionDate={previsionDate}
            setPrevisionDate={setPrevisionDate}
            errorMessage={errorMessage} 
            setErrorMessage={setErrorMessage}
            doSave={doSave}
            closeModal={closeModal}
        />
    </>);
}