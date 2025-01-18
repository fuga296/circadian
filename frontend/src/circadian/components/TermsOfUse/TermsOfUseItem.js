import React from "react";
import styles from "./TermsOfUseItem.module.css";


const ArrayToListElements = ({ array }) => {
    return (
        <ol className={styles.rulesList}>
            {
                array.map((element, index) => (
                    <li className={styles.rulesListItem} key={index}>
                        {
                            Array.isArray(element)
                            ? <ArrayToListElements array={element} />
                            : typeof element === "object"
                                ? (
                                    <>
                                        {element.parent}
                                        <ArrayToListElements array={element.rules} />
                                    </>
                                )
                                : element
                        }
                    </li>
                ))
            }
        </ol>
    );
};

const TermsOfUseItem = ({ title, paragraph, rules, index }) => {
    return (
        <>
            <h2 className={styles.title}>第{index}条（{title}）</h2>
            {paragraph && <p className={styles.paragraph}>{paragraph}</p>}
            {rules && <ArrayToListElements array={rules} />}
        </>
    );
};

export default TermsOfUseItem;