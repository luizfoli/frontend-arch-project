import moment from "moment";
import { NextPage } from "next";

import { Modal } from 'react-bootstrap';

type ModalProps = {
    showModal: boolean,

    name: string,
    previsionDate: string,
    errorMessage: string,
    closeModal(): void,
    doSave(): void,
    setName(s: string): void,
    setPrevisionDate(s: string): void,
    setErrorMessage(s: string): void
}

export const CrudModal : NextPage<ModalProps> = (
    { 
        showModal,
        name,
        previsionDate,
        errorMessage,
        closeModal,
        doSave,
        setName,
        setPrevisionDate
    }) => {
    return (
        <Modal
            show={showModal}
            onHide={() => closeModal()}
            className="container-modal">
                <Modal.Body>
                    <p>Adicionar uma tarefa</p>
                    {errorMessage && <p className="errorMessage">{errorMessage}</p>}
                    <input type="text"
                        placeholder="Adicionar uma tarefa"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <input type="text"
                        placeholder="Data de previsao de conclusao"
                        value={previsionDate}
                        onChange={e => setPrevisionDate(e.target.value)}
                        onFocus={e => e.target.type = "date"}
                        onBlur={ e => previsionDate ? e.target.type ="date": e.target.type="text" }
                    />
                </Modal.Body>
                <Modal.Footer>
                    <div className="button col-12">
                        <button onClick={doSave}>Salvar</button>
                        <span onClick={closeModal}>Cancelar</span>
                    </div>
                </Modal.Footer>
        </Modal>
    );
}