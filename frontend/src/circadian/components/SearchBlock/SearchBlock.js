import React, { useState } from "react";
import styles from "./SearchBlock.module.css";
import searchSVG from "../../assets/images/search.svg";


const SearchBlock = ({ setCommond, handleSearch, handleChangeIsCommand, style }) => {

    const [isCommand, setIsCommand] = useState(false);
    const [searchText, setSearchText] = useState("");

    const toggleIsCommand = () => {
        handleChangeIsCommand(!isCommand);
        setIsCommand(prev => !prev);
    };

    const handleChangeSearchText = (e) => {
        const value = e.target.value
        setSearchText(value);
        setCommond(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        handleSearch(searchText);
    };

    return (
        <div className={styles.searchBlockWrapper}>
            <form className={`${styles.searchBlock} ${style}`}>
                <button
                    type="button"
                    onClick={toggleIsCommand}
                    className={`${styles.toggleIsCommandBtn} ${isCommand && styles.purpleToggleIsCommandBtn}`}
                    title={isCommand ? "コマンドモードをやめる" : "コマンドモードにする"}
                >
                    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.toggleIsCommandImg}>
                        <path d="M10.4779 1.64705C10.5591 1.38312 10.411 1.10333 10.1471 1.02212C9.88312 0.940912 9.60333 1.08904 9.52212 1.35297L5.52212 14.353C5.44091 14.6169 5.58904 14.8967 5.85297 14.9779C6.1169 15.0591 6.39669 14.911 6.4779 14.6471L10.4779 1.64705Z" fill="currentColor"/>
                        <path d="M4.85355 4.14645C5.04882 4.34171 5.04882 4.65829 4.85355 4.85355L1.70711 8L4.85355 11.1464C5.04882 11.3417 5.04882 11.6583 4.85355 11.8536C4.65829 12.0488 4.34171 12.0488 4.14645 11.8536L0.646447 8.35355C0.451184 8.15829 0.451184 7.84171 0.646447 7.64645L4.14645 4.14645C4.34171 3.95118 4.65829 3.95118 4.85355 4.14645Z" fill="currentColor"/>
                        <path d="M11.1464 4.14645C10.9512 4.34171 10.9512 4.65829 11.1464 4.85355L14.2929 8L11.1464 11.1464C10.9512 11.3417 10.9512 11.6583 11.1464 11.8536C11.3417 12.0488 11.6583 12.0488 11.8536 11.8536L15.3536 8.35355C15.5488 8.15829 15.5488 7.84171 15.3536 7.64645L11.8536 4.14645C11.6583 3.95118 11.3417 3.95118 11.1464 4.14645Z" fill="currentColor"/>
                    </svg>
                </button>

                <input
                    type="search"
                    className={`${styles.searchBox} ${isCommand && styles.commandSearchBox}`}
                    placeholder={isCommand ? "検索コマンドを入力" : "検索語句を入力"}
                    value={searchText}
                    onChange={handleChangeSearchText}
                />

                <button type="submit" className={styles.searchBtn} onClick={handleSubmit}>
                    <img src={searchSVG} alt="search" className={styles.searchImg} />
                </button>
            </form>
        </div>
    );
};

export default SearchBlock;