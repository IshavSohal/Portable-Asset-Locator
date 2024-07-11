import { useEffect, useState } from 'react';

function MessageDisplay() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        // fetch data
        const dataFetch = async () => {
            const res = await fetch('/api/start');
            if (!res.ok) {
                // This will activate the closest `error.js` Error Boundary
                const errorText = await res.text();

                setMessage('Error fetching data: ' + errorText);
            }
            const message = await res.text();
            // set state when the data received
            setMessage(message);
        };

        dataFetch();
    }, []);

    return <p>The message from the server is: {message}</p>;
}

export default MessageDisplay;
