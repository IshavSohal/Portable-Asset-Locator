import { fetchGet } from "./requests";


const fetchHelloWorld: () => Promise<string> = async () => {
    const message = await(await fetchGet('/api/HelloWorld/start')).text();
    return message as string;
}

export { fetchHelloWorld };