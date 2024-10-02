import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './components/AppRoutes';
import "./App.css"
import axiosInstance from './api/axiosConfig';

const AppContent = () => {
    useEffect(() => {
        const logVisit = async () => {
            try {
                await axiosInstance.post('/circadian/api/log/create/', {
                    status: 'VISIT',
                    detail: window.location.href
                });
            } catch (error) {
                console.error("Visit log error:", error);
            }
        };

        const logLeave = async () => {
            try {
                await axiosInstance.post('/circadian/api/log/create/', {
                    status: 'LEAVE',
                    detail: window.location.href
                });
            } catch (error) {
                console.error("Leave log error:", error);
            }
        };

        logVisit();
        window.addEventListener('beforeunload', logLeave);

        return () => {
            document.removeEventListener('DOMContentLoaded', logVisit);
            window.removeEventListener('beforeunload', logLeave);
        };
    }, []);

    return <AppRoutes />;
}

const App = () => {
    return (
        <Router>
            <div className="App">
                <AppContent />
            </div>
        </Router>
    );
}

export default App;