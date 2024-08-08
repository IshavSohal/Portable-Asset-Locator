import { Link } from 'react-router-dom';
import MainTemplate from '../templates/MainTemplate';
import { GcdsHeading, GcdsPagination } from '@cdssnc/gcds-components-react';
import MessageDisplay from '../components/MessageDisplay';
import {
    TableContainer,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
} from '@chakra-ui/react';

function Dashboard() {
    const userAssets: asset[] = exampleAssets;

    return (
        <MainTemplate addMargins={false}>
            <GcdsHeading tag="h1">Dashboard</GcdsHeading>
            <div>
                <Link to="/">Home</Link>
            </div>
            <div>
                <MessageDisplay />
            </div>
            <h2>Your assets</h2>
            <h3>Assigned to you</h3>
            <p>Here are all the assets that are currently assigned to you.</p>
            <p>Showing {userAssets.length} results.</p>
            <div>
                <table>
                    <caption>Table of your current assigned assets</caption>
                    <thead>
                        <tr>
                            <th>Asset</th>
                            <th>Asset tag</th>
                            <th>Type</th>
                            <th>Assignment start date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userAssets.map((asset, index) => {
                            return (
                                <tr key={asset.id}>
                                    <td>{asset.name}</td>
                                    <td>{asset.tag}</td>
                                    <td>{asset.type}</td>
                                    <td>{asset.startDate.toDateString()}</td>
                                </tr>
                            );
                        })}
                    </tbody>

                    <tr></tr>
                </table>
                {/* <GcdsPagination
                label="Pagination"
                totalPages={2}
                currentPage={1}
            ></GcdsPagination> */}
            </div>
        </MainTemplate>
    );
}

export default Dashboard;

type asset = {
    id: number;
    name: string;
    tag: string;
    type: string;
    startDate: Date;
};

const exampleAssets = [
    {
        id: 1,
        name: 'Dell Laptop',
        tag: 'A12345',
        type: 'Laptop',
        startDate: new Date('August 1, 2024'),
    },
    {
        id: 2,
        name: 'Dell Mouse',
        tag: 'A12367',
        type: 'Mouse',
        startDate: new Date('August 1, 2024'),
    },
];
