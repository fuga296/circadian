import React from "react";
import ContentLayout from "../components/layouts/ContentLayout";

const NotFound = () => {
    return (
        <ContentLayout
            header={
                <h1>ページが見つかりません</h1>
            }

            main={
                <p>urlを確認してください.</p>
            }
        />
    );
};

export default NotFound;