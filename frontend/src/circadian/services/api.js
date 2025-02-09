import { BASE_API_PATH } from "../config/apiConfig";
import axiosInstance from "./axiosConfig";



export const getUserInfo = async () => {
    const response = await axiosInstance.get(BASE_API_PATH + 'user/');
    return response;
};

export const updateUserInfo = async newUserInfo => {
    const response = await axiosInstance.patch(
        BASE_API_PATH + 'user/',
        newUserInfo,
    );
    return response;
};


export const createDiary = async diary => {
    await axiosInstance.post(
        BASE_API_PATH + 'diary/create/', diary
    );
    createDiaryHistory({
        diary_date: diary.date,
        action: 'CREATE',
        ...diary,
    });
};

export const getDiary = async (year, month, day) => {
    const response = await axiosInstance.get(BASE_API_PATH + `diary/${year}-${month}-${day}/`);
    return response;
};

export const editDiary = async (year, month, day, newDiary) => {
    await axiosInstance.patch(
        BASE_API_PATH + `diary/${year}-${month}-${day}/`,
        newDiary,
    );
    createDiaryHistory({
        diary_date: newDiary.date,
        action: 'EDIT',
        ...newDiary,
    });
};

export const deleteDiary = async (year, month, day) => {
    await axiosInstance.delete(BASE_API_PATH + `diary/${year}-${month}-${day}/`);
};

export const getDiaryBlocks = async (pageNum, searchText="", isCommand=false) => {
    const response = await axiosInstance.get(BASE_API_PATH + `diary/blocks/?page=${pageNum}&is-command=${isCommand}&search-text=${searchText}`);
    return response;
};

export const getDiaryList = async pageNum => {
    const response = await axiosInstance.get(BASE_API_PATH + `diary/list?page=${pageNum}`);
    return response;
};

export const getDiariesByMonth = async (year, month) => {
    const response = await axiosInstance.get(BASE_API_PATH + `diary/${year}-${month}/`);
    return response;
};

export const getDiariesExistence = async () => {
    const response = await axiosInstance.get(BASE_API_PATH + 'diary/existence/');
    return response;
}


export const createDiaryHistory = async diaryHistory => {
    await axiosInstance.post(
        BASE_API_PATH + 'history/create/', diaryHistory
    );
};

export const getDiaryHistory = async (year, month, day, pageNum) => {
    const response = await axiosInstance.get(BASE_API_PATH + `history/${year}-${month}-${day}/?page=${pageNum}`);
    return response;
};

export const getAllDiaryHistory = async pageNum => {
    const response = await axiosInstance.get(BASE_API_PATH + `history/all/?page=${pageNum}`);
    return response;
};


export const createLog = async logInfo => {
    await axiosInstance.post(
        BASE_API_PATH + 'log/create/', logInfo
    )
};