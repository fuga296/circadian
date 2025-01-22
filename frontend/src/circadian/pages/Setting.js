import React, { useContext } from "react";
import ContentLayout from "../components/Layouts/ContentLayout";
import SettingComponent from "../components/Setting/SettingComponent";
import { updateUserInfo } from "../services/api";
import { UserInfoContext } from "../contexts/UserInfoContext";

const Setting = () => {

    const { userInfo, setUserInfo } = useContext(UserInfoContext);

    const handlers = {
        handleSubmit: async () => {
            await updateUserInfo(userInfo);
        },
        handleChangeUserInfo: (userInfo) => {
            setUserInfo((prev) => ({
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
                </>
            }
            main={
                <SettingComponent
                    info={userInfo}
                    handlers={handlers}
                />
            }
        />
    );
};

export default Setting;