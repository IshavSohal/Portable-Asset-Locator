import MainTemplate from '../templates/MainTemplate';
import {
  GcdsButton,
  GcdsContainer,
  GcdsDateModified,
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
import { useNavigate } from 'react-router-dom'; 

function Dashboard() {
  const [userAssets, setUserAssets] = useState<asset[]>([]);
  const { user } = useAuth();

  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      try {
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
    <MainTemplate currentPage="my-assets">
      <GcdsHeading tag="h1">Dashboard</GcdsHeading>
      <GcdsText>
        Welcome, {user?.firstName} {user?.lastName} ({user?.email}) !
      </GcdsText>
      <GcdsHeading tag="h2" marginBottom="0">
        Your assets
      </GcdsHeading>
      <GcdsHeading tag="h3" marginTop="400">
        Assigned to you
      </GcdsHeading>
      <GcdsText>
        Here are all the assets that are currently assigned to you.
      </GcdsText>
      <GcdsContainer padding-left='1000'>
      <GcdsButton onClick={() => navigate('/unassigned-assets')}>
          Request asset
      </GcdsButton>
      </GcdsContainer>
      <GcdsContainer border padding="400" margin="0">
        <GcdsText size="caption">Showing {userAssets.length} results.</GcdsText>
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
            ) : userAssets.length === 0 ? (
              <Tbody>No records</Tbody>
            ) : (
              <Tbody>
                {userAssets.map((asset) => {
                  return (
                    <Tr key={asset.id}>
                      <Td>
                        <GcdsLink href={`/asset/${asset.id}`}>
                          {asset.name}
                        </GcdsLink>
                      </Td>
                      <Td>{asset.assetTag}</Td>
                      <Td>{asset.type}</Td>
                      <Td>{asset.assignedOn.toDateString()}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            )}
          </Table>
        </TableContainer>
      </GcdsContainer>
      <GcdsContainer size="xl" centered style={{ paddingBottom: 10 }}>
        <GcdsDateModified> 2024-09-10 </GcdsDateModified>
      </GcdsContainer>
    </MainTemplate>
  );
}

export default Dashboard;

type asset = {
  id: number;
  name: string;
  assetTag: string;
  type: string;
  assignedOn: Date;
};

async function fetchUserAssets() {
  const response = await fetchGet('/api/asset/user');
  if (response.ok) {
    const assets = await response.json();
    return assets.map((a: asset) => {
      return { ...a, assignedOn: new Date(a.assignedOn) };
    });
  } else {
    throw new Error(
      'fetchUserAssets Error:' + response.status + (await response.text())
    );
  }
}
// const exampleAssets = [
//     {
//         id: 1,
//         name: 'Dell Laptop',
//         assetTag: 'A12345',
//         type: 'Laptop',
//         assignedOn: new Date('August 1, 2024'),
//     },
//     {
//         id: 2,
//         name: 'Dell Mouse',
//         assetTag: 'A12367',
//         type: 'Mouse',
//         assignedOn: new Date('August 1, 2024'),
//     },
// ];
