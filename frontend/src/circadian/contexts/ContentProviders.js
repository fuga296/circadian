import React from "react";
import { DiariesProvider } from "./DiariesContext";
import { DiariesExistenceProvider } from "./DiariesExistenceContext";
import { UserInfoProvider } from "./UserInfoContext";

const providers = [DiariesProvider, DiariesExistenceProvider, UserInfoProvider];

const ContentProviders = ({ children }) => {
    return providers.reduce(
        (AccumulatedProviders, CurrentProvider) => (
            <CurrentProvider>{AccumulatedProviders}</CurrentProvider>
        ),
        children
    );
};

export default ContentProviders;