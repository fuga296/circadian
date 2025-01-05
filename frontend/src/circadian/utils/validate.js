export const validateDate = (date) => {
    return !!(new Date(date));
};

export const validateUsername = (name) => {
    let errorBinary = 0;
    if (name.length < 3 || 63 < name.length) {
        errorBinary += 1;
    };
    if (!/^[a-zA-Z0-9._-]+$/.test(name)) {
        errorBinary += 2
    };
    return errorBinary;
};

export const validateEmail = (email) => {
    let errorBinary = 0;
    const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailPattern.test(email)) {
        errorBinary += 1;
    };
    return errorBinary;
};

export const validatePassword = (password) => {
    let errorBinary = 0;
    if (password.length < 8 || 127 < password.length) {
        errorBinary += 1;
    };
    if (!/[a-zA-Z]/.test(password)) {
        errorBinary += 2;
    };
    if (!/\d/.test(password)) {
        errorBinary += 4;
    };
    if (!/^[a-zA-Z0-9!#$%&^~|@+*]+$/.match(password)) {
        errorBinary += 8;
    };
    return errorBinary;
};