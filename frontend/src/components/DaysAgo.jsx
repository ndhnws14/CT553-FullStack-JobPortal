const DaysAgo = (date) => {
    const diff = new Date(date) - new Date();
    return Math.floor((diff / (1000 * 60 * 60 * 24)) + 1);
};

export default DaysAgo;