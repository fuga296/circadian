import React from "react";
import ContentLayout from "../components/Layouts/ContentLayout";
import Modal from "../../components/Modal";

const Home = () => {
    return (
        <ContentLayout
            header={<h1>ホーム</h1>}
            main={
                <div>
                    <Modal>メインです。</Modal>
                </div>
            }
        />
    );
};

export default Home;