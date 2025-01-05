export const removeDuplicate = (array, flag) => {
    const seen = new Set();
    return array.filter(item => {
        if(seen.has(item[flag])) return false;
        seen.add(item[flag]);
        return true;
    });
};