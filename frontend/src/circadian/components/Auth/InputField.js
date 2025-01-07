import React from "react";
import styles from "./InputField.module.css";

const InputField = ({
    label, type, name, placeholder, value, onChange, messages,
}) => (
    <div className={styles.inputBlock}>
        <label htmlFor={name}>{label}</label>
        <input
            type={type}
            name={name}
            id={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
        <div>
            {messages.map((msg, index) => (
                <p className={styles.inputMessage} key={index}>※{msg}</p>
            ))}
        </div>
    </div>
);

export default InputField;