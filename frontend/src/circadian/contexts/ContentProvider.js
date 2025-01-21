import React from "react";
import { DiariesProvider } from "./diariesContext";
import { DiariesExistenceProvider } from "./diariesExistenceContext";
import { UserInfoProvider } from "./userInfoContext";

const providers = [DiariesProvider, DiariesExistenceProvider, UserInfoProvider];

const ContentProvider = ({ children }) => {
    return providers.reduce(
        (AccumulatedProviders, CurrentProvider) => (
            <CurrentProvider>{AccumulatedProviders}</CurrentProvider>
        ),
        children
    );
};

export default ContentProvider;