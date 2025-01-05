import { useEffect } from "react";
import { FEEDBACK_URL } from "../config/feedback";

const Feedback = () => {
    useEffect(() => {
        window.location.href = FEEDBACK_URL;
    }, [])
};

export default Feedback;