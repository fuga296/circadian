import React from "react";
import ContentLayout from "../components/layouts/ContentLayout";

const Home = () => {
    return (
        <ContentLayout
            header={<h1>ホーム</h1>}
            main={
                <div>
                    メインです。
                </div>
            }
        />
    );
};

export default Home;