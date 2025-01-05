import React from "react";
import ContentLayout from "../components/layouts/ContentLayout";
import Accordion from "../../components/Accordion";

const Home = () => {
    return (
        <ContentLayout
            header={<h1>ホーム</h1>}
            main={
                <div>
                    <Accordion
                        title="Accordion Title"
                        content="This is the content of the accordion. It will toggle on click."
                    />
                </div>
            }
        />
    );
};

export default Home;