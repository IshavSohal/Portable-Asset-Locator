/**
 * Formats a date into either 'Month Date, Year' format or 'yyyy-mm-dd' format
 *
 * @param {string | null} date the date string to be formatted
 * @param {boolean} verbose whether to format the date in 'Month Date, Year' format
 * @returns {string} the formatted date string or 'N/A'
 */
const dateFormatter = (date: string | null, verbose: boolean = false): string => {
    if (date && date !== 'N/A'){
        const d = new Date(date);

        if (verbose){
            const months = [ "January", "February", "March", "April", "May", "June", 
                "July", "August", "September", "October", "November", "December" ]

            return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
        }
        return d.getFullYear() + '-' + ((d.getMonth()+1).toString()).padStart(2, '0') + '-' + d.getDate();
    } 

    return 'N/A';
}


export { dateFormatter };