import { useCallback, useEffect } from "react";

const useInfiniteScroll = ({ loading, isDiariesMax, incrementPageNumber }) => {
    const handleScroll = useCallback(() => {
        if (
            !loading &&
            !isDiariesMax &&
            window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1
        ) {
            incrementPageNumber();
        }
    }, [incrementPageNumber, isDiariesMax, loading]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll])
};

export default useInfiniteScroll;