import { useContext, createContext, useState, PropsWithChildren } from 'react';

type AuthContextType = {
    user: user | null;
    logIn: (email: string) => void; // TO-DO update func params
    logOut: () => void;
} | null;

type user = {
    id: number;
    email: string;
};

const AuthContext = createContext<AuthContextType>(null);

const AuthProvider = ({ children }: PropsWithChildren) => {
    const [user, setUser] = useState<user | null>(null);

    const logIn = (email: string) => {
        /** TODO
         *    - make request to fetch user
         *    - if successful, update user and redirect to _______
         *    - if unsuccessful, return error
         */
        const userData = {
            id: 1,
            email,
        };
        setUser(userData);
    };

    const logOut = () => {
        setUser(null);
        // TO-DO: redirect to login
    };

    return (
        <AuthContext.Provider value={{ user, logIn, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};
