import { Link } from 'react-router-dom';
import MainTemplate from '../templates/MainTemplate';
import {
    GcdsContainer,
    GcdsHeading,
    GcdsLink,
    GcdsText,
} from '@cdssnc/gcds-components-react';
import MessageDisplay from '../components/MessageDisplay';
import {
    TableContainer,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
} from '@chakra-ui/react';

function Dashboard() {
    const userAssets: asset[] = exampleAssets;

    return (
        <MainTemplate>
            <GcdsHeading tag="h1">Dashboard</GcdsHeading>
            <div>
                <Link to="/">Home</Link>
            </div>
            <div>
                <MessageDisplay />
            </div>
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
                        <TableCaption>
                            Table of your current assigned assets
                        </TableCaption>
                        <Thead>
                            <Tr>
                                <Th>Asset</Th>
                                <Th>Asset tag</Th>
                                <Th>Type</Th>
                                <Th>Assignment start date</Th>
                            </Tr>
                        </Thead>
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
