const registerUser = async ({firstName, lastName, email, password } : {firstName: string, lastName: string, email: string, password: string}) => {
    const data = {
        firstName, 
        lastName,
        email,
        password
    }

    const server = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8080';

    const response = await fetch(server + "/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const res = await response.json();

    if (response.ok) {
        return res;
    } else {
        // propagate Error so that it may be handled on frontend
        throw new Error(res.message); 
    }
}

export { registerUser };