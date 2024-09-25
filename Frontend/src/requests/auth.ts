import { user } from '../types/data'
import { fetchPost, fetchGet } from './requests';


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

const loadUser = async() => {
  const response = await fetchGet("/api/auth/profile");
  if (response.ok) {
    return await response.json() as user;
  } else {
    // propagate Error so that it may be handled on frontend
    const { status } = response
    throw new Error("loadUser Error:" + status + await response.text()); 
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

const logoutUser = async () => {
  const response = await fetchGet("/api/auth/logout");
  if (!response.ok) {
    throw new Error(await response.text());
  } 
}

export { registerUser, loginUser, logoutUser, loadUser };