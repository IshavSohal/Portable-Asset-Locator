interface FetchCall<T> {
    (endpoint: string): Promise<T>;
}

// Experimental - refactoring for more streamlined GET requests.
// TO-DO: more testing
const fetchGet: FetchCall<any> = async (endpoint) => {
    // During development, we want to run the client
    // with the faster npm run start (instead of npm run build everytime a change is made)
    const server = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8080';
    
    const res = await fetch(server + endpoint, {
        credentials: 'include'
    });
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error('FetchGet Error - Error fetching data: ' + errorText);
    }
    return res.text();
}


const fetchHelloWorld: () => Promise<string> = async () => {
    const message = await fetchGet('/api/HelloWorld/start');
    return message as string;
}

export { fetchHelloWorld };