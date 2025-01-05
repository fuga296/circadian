export const AUTH_INPUT_FIELDS = [
    // ristrictについて、1:権限あり,0:権限無し 2進数で一桁目がログイン,二桁目が新規登録
    {
        text: {
            label: "ユーザーネーム",
            id: "username",
            placeholder: "Username",
        },
        type: "text",
        ristrict: 3,
    },
    {
        text: {
            label: "メールアドレス",
            id: "email",
            placeholder: "Email",
        },
        type: "email",
        ristrict: 2,
    },
    {
        text: {
            label: "パスワード",
            id: "password",
            placeholder: "Password",
        },
        type: "password",
        ristrict: 3,
    },
    {
        text: {
            label: "再パスワード",
            id: "passwordAgain",
            placeholder: "Password Again",
        },
        type: "password",
        ristrict: 2,
    },
];