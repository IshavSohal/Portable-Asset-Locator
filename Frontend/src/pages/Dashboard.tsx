import { Link } from 'react-router-dom';
import MessageDisplay from '../components/MessageDisplay';

function Dashboard() {
    return (
        <div>
            <h1>Dashboard</h1>
            <div>
                <Link to='/'>Home</Link>
            </div>
            <div>
                <MessageDisplay />
            </div>
        </div>
    );
}

export default Dashboard;
