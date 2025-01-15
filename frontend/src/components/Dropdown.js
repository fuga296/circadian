import React from "react";
import styles from "./Modal.module.css";

const Modal = ({ children, className, style }) => {
    return (
        <div className={`${styles.modal} ${className}`} style={style}>
            {children}
        </div>
    )
}

export default Modal;