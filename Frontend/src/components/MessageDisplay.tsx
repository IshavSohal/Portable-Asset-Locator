import { useEffect, useState } from 'react';
import { fetchHelloWorld } from '../requests/simple';

function MessageDisplay() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        // fetch data
        const dataFetch = async () => {
            const message = await fetchHelloWorld();
            // set state when the data received
            setMessage(message);
        };

        dataFetch();
    }, []);

    return <p>The message from the server is: {message}</p>;
}

export default MessageDisplay;
