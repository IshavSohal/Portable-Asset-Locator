const fetchPost = async(endpoint: string, data: any): Promise<Response> => {
    const server = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8080';
  
    const response = await fetch(server + endpoint, {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    return response
  
  }

  const fetchGet = async (endpoint: string): Promise<Response> => {
    const server = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8080';
    
    const res = await fetch(server + endpoint, {
        credentials: 'include'
    });
    
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error('FetchGet Error - Error fetching data: ' + errorText);
    }
    return res;
}

export { fetchGet, fetchPost }