import { user } from '../types/user'
interface FetchPost<T> {
  (endpoint: string, data: any): Promise<any>;
}

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

const loginUser = async (data : {email: string, password: string}): Promise<user> => {
  const response = await fetchPost("/api/auth/login", data);
  if (response.ok) {
      const res = await response.json();
      return res as user;
  } else {
      // propagate Error so that it may be handled on frontend
      const { status } = response
      throw new Error("loginUser Error:" + status + await response.text()); 
  }
}


const registerUser = async (data : {firstName: string, lastName: string, email: string, password: string}) => {

    const response = await fetchPost("/api/auth/register", data)
    // const res = await response.json();

    if (response.ok) {
        return "Created";
    } else {
        // propagate Error so that it may be handled on frontend
        throw new Error(await response.text()); 
    }
}

export { registerUser, loginUser };