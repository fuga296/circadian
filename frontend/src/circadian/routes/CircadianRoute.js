import React from "react";
import { Route, Routes } from 'react-router-dom';
import PageLayout from "../components/Layouts/PageLayout";
import AddDiary from "../pages/AddDiary";
import ReadDiary from "../pages/ReadDiary";
import Diary from "../pages/Diary";
import ReadList from "../pages/ReadList";
import Calendar from "../pages/Calendar";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import TermsOfUse from "../pages/TermsOfUse";
import Setting from "../pages/Setting";
import Logout from "../pages/Logout";
import Feedback from "../pages/Feedback";
import Login from "../pages/Login";
import Register from "../pages/Register";
import DiaryHistory from "../pages/DiaryHistory";
import AllDiaryHistory from "../pages/AllDiaryHistory";
import "../styles/circadian.css";

const CircadianRoute = () => {
    return (
        <Routes>
            <Route path='/circadian'>
                <Route element={<PageLayout />}>
                    <Route path='home' element={<Home />} />
                    <Route path='add-diary' element={<AddDiary />} />
                    <Route path='read-diary' element={<ReadDiary />} />
                    <Route path='read-list' element={<ReadList />} />
                    <Route path='calendar' element={<Calendar />} />

                    <Route path='setting' element={<Setting />} />
                    <Route path='terms-of-use' element={<TermsOfUse />} />
                    <Route path='logout' element={<Logout />} />
                    <Route path='feedback' element={<Feedback />} />

                    <Route path='diary/:year/:month/:day' element={<Diary />} />

                    <Route path='history' element={<AllDiaryHistory />} />
                    <Route path='history/:year/:month/:day' element={<DiaryHistory />} />

                    <Route path='*' element={<NotFound />} />
                </Route>

                <Route path="auth">
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default CircadianRoute;