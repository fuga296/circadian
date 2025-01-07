export const validateDate = (date) => {
    return !!(new Date(date));
};

export const validateUsername = (name) => {
    let errorArray = [];
    if (name.length < 3 || 63 < name.length) {
        errorArray.push("ユーザーネームは3字以上64字未満にしてください");
    };
    if (!/^[a-zA-Z0-9._-]+$/.test(name)) {
        errorArray.push("半角英数字、ドット、アンダースコア、ハイフン以外の文字を使わないでください")
    };
    return errorArray;
};

export const validateEmail = (email) => {
    let errorArray = [];
    const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailPattern.test(email)) {
        errorArray.push("RFCの規格に従ったメールアドレスにしてください");
    };
    return errorArray;
};

export const validatePassword = (password) => {
    let errorArray = [];
    if (password.length < 8 || 127 < password.length) {
        errorArray.push("パスワードは8字以上128字未満でなければなりません");
    };
    if (!/[a-zA-Z]/.test(password)) {
        errorArray.push("基本ラテン文字を一字以上用いてください");
    };
    if (!/\d/.test(password)) {
        errorArray.push("数字を一字以上用いてください");
    };
    if (!/^[a-zA-Z0-9!#$%&^~|@+*]+$/.test(password)) {
        errorArray.push("半角英数字、許可された記号(!#$%&^~|@+*)以外を用いないでください");
    };
    return errorArray;
};