const FormatApplyDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            return dateString.split("T")[0];
        }
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    } catch (error) {
        console.error("Error formatting date:", error);
        return dateString.split("T")[0];
    }
};

export default FormatApplyDate;