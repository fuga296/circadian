import React from "react";
import ContentLayout from "../components/layouts/ContentLayout";

const TermsOfUse = () => {
    return (
        <ContentLayout
            header={
                <h1>利用規約</h1>
            }
            main={
                <div>
                    <ul>
                        <li>勝手な行動しないこと</li>
                    </ul>
                </div>
            }
        />
    );
};

export default TermsOfUse;