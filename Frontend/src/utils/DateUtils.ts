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

const calculateDateDiff = (firstDate: Date, secondDate: Date, unit: 'years' | 'months' | 'days'): number => {

    const millisecondsDiff = secondDate.getTime() - firstDate.getTime();
    const millisecondsInDay = 24 * 60 * 60 * 1000; 
    if (unit == 'days') {
        return Math.round(
            millisecondsDiff / millisecondsInDay
        )
    } else if (unit == 'months') {
        return Math.round(
            millisecondsDiff / (millisecondsInDay * 30)
        )
    } else if (unit == 'years') {
        return Math.round(
            millisecondsDiff / (millisecondsInDay * 365)
        )
    } 

    return 0;
}


export { dateFormatter, calculateDateDiff };