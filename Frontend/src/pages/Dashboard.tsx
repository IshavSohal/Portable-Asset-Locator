import { Link } from 'react-router-dom';
import MainTemplate from '../templates/MainTemplate';
import { GcdsHeading } from '@cdssnc/gcds-components-react';
import MessageDisplay from '../components/MessageDisplay';
import { useAuth } from '../hooks/AuthProvider';

function Dashboard() {
    const { user, logOut } = useAuth();
    return (
        <MainTemplate>
            <GcdsHeading tag="h1">Dashboard</GcdsHeading>
            <p>
                Hello {user?.firstName} {user?.lastName}!
            </p>
            <p>
                {user?.email} | Your role: {user?.role}
            </p>

            {/* The following code is for experimentation */}
            <div>
                <Link to="/">Home</Link>
            </div>
            <div>
                <MessageDisplay />
            </div>
            <button onClick={logOut}>Log out</button>
        </MainTemplate>
    );
}

export default Dashboard;
