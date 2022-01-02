import { NextPage } from "next";
import { isTargetLikeServerless } from "next/dist/server/config";
import { useState } from "react";

import { Task } from "../types/Task";
import { Item } from "./Item";
import { CrudModal } from "./Modal";

type ListProps = {
    tasks : Task[]
}

export const List : NextPage<ListProps> = ({ tasks }) => {

        // State Modal
        const [showModal, setShowModal] = useState(false);
        const [errorMessage, setErrorMessage] = useState("");
        const [id, setId] = useState("")
        const [name, setName] = useState("");
        const [previsionDate, setPrevisionDate] = useState("");
        const [finishDate, setFinishDate] = useState("");
        
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

    const selectTask = (task: Task) => {
        
    }

    return (
        <div className={"container-list" + (tasks && tasks.length > 0 ? "" : " empty")}>
            { tasks && tasks.length > 0 
                ?  
                    tasks.map(task => <Item key={task._id} task={task} />)
                :
                <>
                    <img src="/empty.svg" alt="Nenhuma tarefa encontrada"/>
                    <p>Você ainda não possui tarefas cadastradas!</p>
                </>
            }
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
        </div>
    );
}