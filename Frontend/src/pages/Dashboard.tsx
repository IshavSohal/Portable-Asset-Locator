import { Link } from 'react-router-dom';
import MainTemplate from '../templates/MainTemplate';
import { GcdsHeading } from '@cdssnc/gcds-components-react';
import MessageDisplay from '../components/MessageDisplay';
import { useAuth } from '../hooks/AuthProvider';

function Dashboard() {
    const { user, logOut } = useAuth();
    return (
        <MainTemplate addMargins={false}>
            <GcdsHeading tag="h1">Dashboard</GcdsHeading>
            <div>
                <Link to="/">Home</Link>
            </div>
            <div>
                <MessageDisplay />
            </div>
            <div>Hello {user?.email}!</div>
            <button onClick={logOut}>Log out</button>
        </MainTemplate>
    );
}

export default Dashboard;
