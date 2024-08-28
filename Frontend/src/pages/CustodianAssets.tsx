import { GcdsHeading, GcdsText } from '@cdssnc/gcds-components-react';

import { Table, Thead, Tbody, Tr, Th, TableContainer } from '@chakra-ui/react';

import { CustodianAssetCard } from '../components/CustodianAssetCard';
import MainTemplate from '../templates/MainTemplate';
import { useState, useEffect } from 'react';
import { CustodianAsset } from '../types';
import { fetchGet } from '../requests/requests';

function CustodianAssets() {
  const [assets, setAssets] = useState<CustodianAsset[]>([]);
  // const { user } = useAuth();

  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      try {
        const assetsList = (await fetchUserAssets()) as CustodianAsset[];
        // set state when the data received
        // await new Promise((resolve) => setTimeout(resolve, 1000));
        setAssets(assetsList);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    dataFetch();
  }, []);

  return (
    <MainTemplate>
      <GcdsHeading tag="h1">Manage assets</GcdsHeading>
      <GcdsText textRole="secondary" size="caption" marginTop="400">
        These are assets that are under your custodianship.
      </GcdsText>
      <GcdsText size="caption">Showing {assets.length} results.</GcdsText>
      <TableContainer>
        <Table
          variant="striped"
          colorScheme="blackAlpha"
          size="lg"
          marginBottom="100"
        >
          <Thead>
            <Tr>
              <Th>Asset</Th>
              <Th>Asset Tag</Th>
              <Th>Type</Th>
              <Th>Location</Th>
              <Th>Age (years)</Th>
              <Th>Assigned to</Th>
            </Tr>
          </Thead>
          {loading ? (
            <Tbody>Loading...</Tbody>
          ) : error ? (
            <Tbody>Error: {error}</Tbody>
          ) : assets.length === 0 ? (
            <Tbody>No records</Tbody>
          ) : (
            <Tbody>
              {assets.map((asset) => (
                <CustodianAssetCard key={asset.id} asset={asset} />
              ))}
            </Tbody>
          )}
        </Table>
      </TableContainer>
    </MainTemplate>
  );
}

export default CustodianAssets;

async function fetchUserAssets() {
  const response = await fetchGet('/api/asset/custodian');
  if (response.ok) {
    const assets = await response.json();
    return assets.map((a: CustodianAsset) => {
      return { ...a };
    });
  } else {
    throw new Error(
      'fetchUserAssets Error:' + response.status + (await response.text())
    );
  }
}

const mockAssets: CustodianAsset[] = [
  {
    id: 1,
    name: 'Laptop',
    assetTag: '1123',
    type: 'Laptop',
    location: 'Toronto',
    age: 10,
    dateOfPurchase: new Date('August 26, 2023'),
    assignedTo: 'Johndo@ec.gc.ca',
  },
  {
    id: 2,
    name: 'Mouse',
    assetTag: '1123',
    type: 'Laptop',
    location: 'Toronto',
    age: 3,
    assignedTo: null,
  },
  {
    id: 3,
    name: 'Headphone',
    assetTag: '1123',
    type: 'Laptop',
    location: 'Toronto',
    age: 6,
    assignedTo: 'Johndo@ec.gc.ca',
  },
  {
    id: 4,
    name: 'Headphone',
    assetTag: '1123',
    type: 'Laptop',
    location: 'Toronto',
    age: 3000,
    assignedTo: null,
  },
  {
    id: 5,
    name: 'Laptop',
    assetTag: '1123',
    type: 'Laptop',
    location: 'Toronto',
    age: 4,
    assignedTo: 'Johndo@ec.gc.ca',
  },
  {
    id: 1,
    name: 'Mouse',
    assetTag: '1123',
    type: 'Laptop',
    location: 'Toronto',
    age: 7,
    assignedTo: 'Johndo@ec.gc.ca',
  },
  {
    id: 1,
    name: 'Keyboard',
    assetTag: '1123',
    type: 'Laptop',
    location: 'Toronto',
    age: 9,
    assignedTo: 'Johndo@ec.gc.ca',
  },
  {
    id: 1,
    name: 'Monitor',
    assetTag: '1123',
    type: 'Laptop',
    location: 'Toronto',
    age: 7,
    assignedTo: 'Johndo@ec.gc.ca',
  },
  {
    id: 1,
    name: 'Laptop',
    assetTag: '1123',
    type: 'Laptop',
    location: 'Toronto',
    age: 76,
    assignedTo: 'Johndo@ec.gc.ca',
  },
  {
    id: 1,
    name: 'Monitor',
    assetTag: '1123',
    type: 'Laptop',
    location: 'Toronto',
    age: 120,
    assignedTo: 'Johndo@ec.gc.ca',
  },
  {
    id: 1,
    name: 'Laptop',
    assetTag: '1123',
    type: 'Laptop',
    location: 'Toronto',
    age: 30,
    assignedTo: 'Johndo@ec.gc.ca',
  },
];
