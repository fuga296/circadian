export const updateState = (setter) => (key, value) => {
    setter((prev) => ({
        ...prev,
        [key]: value,
    }));
};