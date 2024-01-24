const generateId = () => {
    return Math.random().toString(32).substring(2, 9) + Date.now().toString(32);
};

export default generateId;