import { Link } from 'react-router-dom';
import MainTemplate from '../templates/MainTemplate';
import {
    GcdsContainer,
    GcdsHeading,
    GcdsLink,
    GcdsText,
} from '@cdssnc/gcds-components-react';
import {
    TableContainer,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
} from '@chakra-ui/react';
import { useAuth } from '../hooks/AuthProvider';
import { useEffect, useState } from 'react';
import { fetchGet } from '../requests/requests';

function Dashboard() {
    const [userAssets, setUserAssets] = useState<asset[]>([]);
    const { user, logOut } = useAuth();

    const [error, setError] = useState<null | string>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // fetch data
        const dataFetch = async () => {
            try {
                // const assets = await (await fetchGet("/api/assets")).json() as asset[];
                const assets = (await fetchUserAssets()) as asset[];
                // set state when the data received
                setUserAssets(assets);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        dataFetch();
    }, []);

    return (
        <MainTemplate addMargins={false}>
            <GcdsHeading tag="h1">Dashboard</GcdsHeading>
            <GcdsText>
                Welcome, {user?.firstName} {user?.lastName} ({user?.email}) !
            </GcdsText>
            <button onClick={logOut}>Log out</button>
            <GcdsHeading tag="h2" marginBottom="0">
                Your assets
            </GcdsHeading>
            <GcdsHeading tag="h3" marginTop="400">
                Assigned to you
            </GcdsHeading>
            <GcdsText>
                Here are all the assets that are currently assigned to you.
            </GcdsText>
            <GcdsContainer border padding="400" margin="0">
                <GcdsText size="caption">
                    Showing {userAssets.length} results.
                </GcdsText>
                <TableContainer>
                    <Table>
                        {/* <TableCaption>
                            Table of your current assigned assets
                        </TableCaption> */}
                        <Thead>
                            <Tr>
                                <Th>Asset</Th>
                                <Th>Asset tag</Th>
                                <Th>Type</Th>
                                <Th>Assignment start date</Th>
                            </Tr>
                        </Thead>
                        {loading ? (
                            <Tbody>Loading....</Tbody>
                        ) : error ? (
                            <Tbody>Error: {error}</Tbody>
                        ) : userAssets.length == 0 ? (
                            <Tbody>No records</Tbody>
                        ) : (
                            <Tbody>
                                {userAssets.map((asset) => {
                                    return (
                                        <Tr key={asset.id}>
                                            <Td>
                                                <GcdsLink
                                                    href={`/assets/${asset.id}`}
                                                >
                                                    {asset.name}
                                                </GcdsLink>
                                            </Td>
                                            <Td>{asset.tag}</Td>
                                            <Td>{asset.type}</Td>
                                            <Td>
                                                {asset.startDate.toDateString()}
                                            </Td>
                                        </Tr>
                                    );
                                })}
                            </Tbody>
                        )}
                    </Table>
                </TableContainer>
            </GcdsContainer>
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

async function fetchUserAssets() {
    // TODO: make api request
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const response = await fetchGet('/api/asset/user');
    if (response.ok) {
        const assets = await response.json();
        return assets;
    } else {
        throw new Error(
            'fetchUserAssets Error:' + response.status + (await response.text())
        );
    }
    return exampleAssets;
}
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
