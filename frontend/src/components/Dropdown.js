import React, { useState } from 'react';

const Dropdown = ({ buttonLabel, content, buttonClassName, contentClassName, disableFlag }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <button
                type="button"
                onClick={() => setIsOpen((prev) => disableFlag ? prev : !prev)}
                className={buttonClassName}
                aria-expanded={isOpen}
                aria-label="Toggle meta information modal"
            >
                {buttonLabel}
            </button>
            <div className={contentClassName} style={{ height: !isOpen && "0" }}>
                {content}
            </div>
        </div>
    );
};

export default Dropdown;