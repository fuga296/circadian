export const removeDuplicate = (array, flag) => {
    const seen = new Set();
    return array.filter(item => {
        if(seen.has(item[flag])) return false;
        seen.add(item[flag]);
        return true;
    });
};

export const sortDiaries = diaries => {
    const result = diaries;
    result.sort((a, b) => b.date.localeCompare(a.date));
    return result;
}

export const diaryBlockHeight = (isHistory) => {
    return isHistory ? 500 : 650;
};