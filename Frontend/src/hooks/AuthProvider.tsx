import { useContext, createContext, useState, PropsWithChildren } from 'react';
import { loginUser, loadUser as load, logoutUser } from '../requests/auth';
// import { useNavigate } from 'react-router-dom'
import { user } from '../types/user';

type IAuthContextType = {
    user: user | null;
    logIn: (email: string, password: string) => Promise<void>;
    logOut: () => Promise<void>;
    loadUser: () => Promise<void>;
};

const initialValue = {
    user: null,
    logIn: () => new Promise<void>((resolve) => setTimeout(resolve, 1000)),
    logOut: () => new Promise<void>((resolve) => setTimeout(resolve, 1000)),
    loadUser: () => new Promise<void>((resolve) => setTimeout(resolve, 1000)),
};

const AuthContext = createContext<IAuthContextType>(initialValue);

const AuthProvider = ({ children }: PropsWithChildren) => {
    const [user, setUser] = useState<user | null>(initialValue.user);
    // const navigate = useNavigate()

    const logIn = async (email: string, password: string) => {
        const res = await loginUser({ email, password });
        const userData = res;
        setUser(userData);
        // navigate('/dashboard')
    };

    const logOut = async () => {
        await logoutUser();
        setUser(null);
    };

    const loadUser = async () => {
        const res = await load();
        const userData = res;
        setUser(userData);
    };

    return (
        <AuthContext.Provider value={{ user, logIn, logOut, loadUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};
