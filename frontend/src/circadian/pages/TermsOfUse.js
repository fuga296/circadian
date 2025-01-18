import React from "react";
import ContentLayout from "../components/Layouts/ContentLayout";
import TermsOfUseComponent from "../components/TermsOfUse/TermsOfUseComponent";
import { TERMS_OF_USE } from "../constants/termsOfUse";

const TermsOfUse = () => {
    return (
        <ContentLayout
            header={
                <h1>利用規約</h1>
            }
            main={
                <TermsOfUseComponent termsOfUse={TERMS_OF_USE} />
            }

            footer={
                <>
                    <p>参考: <a href="https://kiyaku.jp/hinagata/gp.html" target="_blank" rel="noopener noreferrer">https://kiyaku.jp/hinagata/gp.html</a></p>
                </>
            }
        />
    );
};

export default TermsOfUse;