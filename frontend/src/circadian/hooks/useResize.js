import { useEffect } from "react";

const useResize = ({ handleResize }) => {
    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [handleResize])
};

export default useResize;