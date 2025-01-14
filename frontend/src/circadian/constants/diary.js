export const SUB_TEXT_SELECTIONS = [
    {
        type: "progress",
        name: "進捗",
    },
    {
        type: "memo",
        name: "メモ",
    },
    {
        type: "TODO",
        name: "TODO",
    },
    {
        type: "file",
        name: "ファイル",
    },
];

export const nuetralDiary = {
    username: "",
    sequence_number: 0,
    date: "",
    text: "",
    progress: "",
    memo: "",
    todos: [],
    file_names: [],
    file_types: [],
    file_urls: [],
    created_at: "",
    updated_at: "",
    front_id: "",
};

export const META_INFO_CONTENTS = [
    {
        name: "連番",
        value: "sequence_number",
    },
    {
        name: "ユーザー",
        value: "username",
    },
    {
        name: "日付",
        value: "date",
    },
    {
        name: "作成日",
        value: "created_at",
    },
    {
        name: "最終編集日",
        value: "updated_at",
    },
    {
        name: "日記ID",
        value: "front_id",
    },
];