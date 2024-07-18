const registerUser = async (firstName: string, lastName: string, email: string, password: string) => {
    const data = {
        firstName, 
        lastName,
        email,
        password
    }
    try {
        const response = await fetch("/api/auth/register", {
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
      } catch (err) {
        console.error(err);
      }
}

export { registerUser };