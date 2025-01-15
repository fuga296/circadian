import React from 'react';
import styles from './Modal.module.css';

const Modal = ({ message, buttonLabel, handleExecute, handleClose }) => {
    return (
        <>
            <div className={styles.modalBackground}></div>
            <div className={styles.modal}>
                <div className={styles.message}>{message}</div>
                <div className={styles.buttons}>
                    <button type='button' className={styles.cancelButton} onClick={handleClose}>
                        キャンセル
                    </button>
                    <button type='button' className={styles.executeButton} onClick={handleExecute}>
                        {buttonLabel}
                    </button>
                </div>
            </div>
        </>
    );
};

export default Modal;