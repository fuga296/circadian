import styles from './Button.modele.css';

const Button = ({ children, className }) => {
    return (
        <button className={`${styles.button} ${className}`}>
            {children}
        </button>
    )
}

export default Button;