import { Route, Routes, Outlet } from 'react-router-dom';
import Home from "./circadian/Home";
import ReadDiary from './circadian/ReadDiary';
import ReadList from './circadian/ReadList';
import Calendar from './circadian/Calendar';
import AddDiary from './circadian/AddDiary';
import Diary from './circadian/Diary';
import Setting from './circadian/Setting';
import TermOfUse from './circadian/TermOfUse';
import Login from './circadian/Login';
import Register from './circadian/Register';
import Navigator from "./circadian/Navigator";
import UserHistory from './circadian/UserHistory';
import DiaryHistory from './circadian/DiaryHistory';
import Files from './circadian/Files';
import ProtectedRoute from './ProtectedRoute';
import NotFound from './circadian/NotFound';
import axiosInstance from '../api/axiosConfig';
import { useEffect } from 'react';


function PageLayout() {
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

    return (
        <>
            <Navigator />
            <Outlet />
        </>
    )
}

function CircadianApp() {
    return (
        <Routes>
            <Route path='/circadian'>
                <Route element={<PageLayout />}>
                    <Route path='home' element={<ProtectedRoute element={<Home />} />} />
                    <Route path='read-diary' element={<ProtectedRoute element={<ReadDiary />} />} />
                    <Route path='read-list' element={<ProtectedRoute element={<ReadList />} />} />
                    <Route path='calendar' element={<ProtectedRoute element={<Calendar />} />} />
                    <Route path='add-diary' element={<ProtectedRoute element={<AddDiary />} />} />
                    <Route path='setting' element={<ProtectedRoute element={<Setting />} />} />
                    <Route path='term-of-use' element={<ProtectedRoute element={<TermOfUse />} />} />

                    <Route path='history/user' element={<ProtectedRoute element={<UserHistory />} />} />
                    <Route path='history/:date' element={<ProtectedRoute element={<DiaryHistory />} />} />

                    <Route path='diary/:date' element={<ProtectedRoute element={<Diary />} />} />

                    <Route path='file/:path' element={<ProtectedRoute element={<Files />} />} />

                    <Route path='*' element={<NotFound />} />
                </Route>

                <Route path='authentication'>
                    <Route path='login' element={<Login />} />
                    <Route path='register' element={<Register />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default CircadianApp;