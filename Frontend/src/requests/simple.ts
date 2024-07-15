const fetchHelloWorld: () => Promise<string> = async () => {
    // During development, we want to run the client
    // with the faster npm run start 
    // (instead of creating a build everytime a change is made)
    // let server = 'http://localhost:8080';
    // if (process.env.NODE_ENV !== 'production') {
    //     server = 'http://localhost:8080' // TODO: Resolve CORS
    // }

    const res = await fetch('/api/HelloWorld/start');
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        const errorText = await res.text();

        return 'Error fetching data: ' + errorText;
    }
    return res.text();
}

export { fetchHelloWorld };