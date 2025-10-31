
export function parseDDMMYYYY(dateString) {
    if (!dateString) return null;

    // Regex to quickly check format: DD/MM/YYYY
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
        return null; 
    }

    // Split and reorder parts into YYYY-MM-DD format, which JS reliably parses.
    const parts = dateString.split('/');
    // parts[0]=Day, parts[1]=Month, parts[2]=Year
    
    // Note: The structure YYYY-MM-DD creates a UTC date, which is standard practice.
    const isoString = `${parts[2]}-${parts[1]}-${parts[0]}`;
    
    const dateAttempt = new Date(isoString);

    // Validate: check if new Date() resulted in "Invalid Date"
    if (isNaN(dateAttempt.getTime())) {
        return null;
    }

    return dateAttempt;
}