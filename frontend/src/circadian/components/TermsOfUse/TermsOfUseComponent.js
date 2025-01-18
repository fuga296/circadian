import React from "react";
import TermsOfUseItem from "./TermsOfUseItem";
import styles from "./TermsOfUseComponent.module.css";

const TermsOfUseComponent = ({ termsOfUse }) => {
    return (
        <div>
            <p className={styles.premise}>この利用規約（以下，「本規約」といいます。）は，当サイトの運営者（以下，「運営者」といいます。）がこのウェブサイト上で提供するサービス（以下，「本サービス」といいます。）の利用条件を定めるものです。登録ユーザーの皆さま（以下，「ユーザー」といいます。）には，本規約に従って，本サービスをご利用いただきます。</p>

            {termsOfUse.map((termOfUse, index) => (
                <TermsOfUseItem
                    title={termOfUse.title}
                    paragraph={termOfUse.paragraph}
                    rules={termOfUse.rules}
                    index={index+1}
                    key={index}
                />
            ))}
            <p class="tR">以上</p>
        </div>
    );
};

export default TermsOfUseComponent;