import { Link } from 'react-router-dom';

function Dashboard() {
    return (
        <div>
            <h1>Dashboard</h1>
            <div>
                <Link to='/'>Home</Link>
            </div>
        </div>
    );
}

export default Dashboard;
