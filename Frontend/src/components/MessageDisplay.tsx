import { useEffect, useState } from 'react';
import { fetchHelloWorld } from '../requests/simple';

function MessageDisplay() {
    const [message, setMessage] = useState('');
    const [error, setError] = useState<null | string>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // fetch data
        const dataFetch = async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            try {
                const message = await fetchHelloWorld();
                // set state when the data received
                setMessage(message);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        dataFetch();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    } else if (error != null) {
        return <p>There was an error getting the message... {error}</p>;
    } else {
        return <p>The message from the server is: {message}</p>;
    }
}

export default MessageDisplay;
