import React from "react";

const LoadingCircle = ({ children, isLoading }) => {
    return (
        <>{
            isLoading ? (
                <div className="circle-spin-1"></div>
            ) : (
                <div>{children}</div>
            )
        }</>
    );
};

export default LoadingCircle;