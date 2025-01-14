import React, { useCallback, useEffect, useState } from "react";
import ContentLayout from "../components/Layouts/ContentLayout";
import SettingComponent from "../components/Setting/SettingComponent";
import { getUserInfo, updateUserInfo } from "../services/api";

const Setting = () => {

    const [info, setInfo] = useState({
        username: "",
        email: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUser = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await getUserInfo();
            if (response?.data) {
                setInfo({ username: response.data.username, email: response.data.email });
            } else {
                setInfo((prev) => prev);
            }
        } catch (err) {
            console.error("Error fetching diary:", err);
            setError("Failed to fetch diary. Please try again later.");
        } finally {
            setLoading(false);
        }

    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const handlers = {
        handleSubmit: async () => {
            await updateUserInfo(info);
        },
        handleChangeUserInfo: (userInfo) => {
            setInfo((prev) => ({
                ...prev,
                ...userInfo,
            }));
        },
    };

    return (
        <ContentLayout
            header={
                <>
                    <h1>設定</h1>
                    {error && <p className="error">{error}</p>}
                    {loading && <p>Loading...</p>}
                </>
            }
            main={
                <SettingComponent
                    info={info}
                    handlers={handlers}
                />
            }
        />
    );
};

export default Setting;