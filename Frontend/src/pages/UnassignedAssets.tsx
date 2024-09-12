import { useState, useEffect } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Flex} from '@chakra-ui/react';
import { GcdsHeading, GcdsSelect, GcdsText } from '@cdssnc/gcds-components-react';
import MainTemplate from '../templates/MainTemplate';
import { UnassignedAsset } from '../types';
import { fetchGet } from '../requests/requests';

function UnassignedAssetsPage() {
    const [assets, setAssets] = useState<UnassignedAsset[]>([]);
    const [selectedType, setSelectedType] = useState<string>('');
    const [selectedCustodian, setSelectedCustodian] = useState<string>('');
    const [selectedLocation, setSelectedLocation] = useState<string>('');
    const [error, setError] = useState<null | string>(null);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dataFetch = async () => {
      try {
        const assetsList = (await fetchUnassignedAssets()) as UnassignedAsset[];
        setAssets(assetsList);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    dataFetch();
  }, []);

  const fetchAssetTypes = async () => {
    const response = await fetchGet('/api/asset/types');
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Failed to fetch asset types');
    }
  };

  return (
    <MainTemplate currentPage="unassigned-assets">
      <GcdsHeading tag="h1">Unassigned Assets</GcdsHeading>
      <GcdsHeading tag="h5">List of all assets</GcdsHeading>
      <GcdsText textRole="secondary" size="caption" marginTop="400">
        There are assets that are not currently assigned and can be requested. Select an asset to see more details and make a request.
      </GcdsText>
      <GcdsHeading tag="h5">Filters</GcdsHeading>
      <Flex style={{gap: '30px'}}>
      <GcdsSelect
          selectId="asset-type-select"
          label="Type"
          name="assetType"
          defaultValue=""
        >
          <option value="">Select a Type</option>
         
        </GcdsSelect>
        <GcdsSelect
          selectId="custodian-select"
          label="Custodian"
          name="custodianEmail"
          defaultValue="Select a Custodian"
          //onChange={(e) => setSelectedCustodian(e.target.value)}
        >
          <option value=""></option>
          {}
        </GcdsSelect>
        <GcdsSelect
          selectId="location-select"
          label="Location"
          name="assetLocation"
          defaultValue="Select a Location"
          //onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value=""></option>
          {}
        </GcdsSelect>
      </Flex>
      <GcdsText size="caption">Showing {assets.length} entries.</GcdsText>
      <TableContainer>
        <Table variant="striped" colorScheme="blackAlpha" size="lg" marginBottom="100">
          <Thead>
            <Tr>
              <Th>Asset</Th>
              <Th>Type</Th>
              <Th>Location</Th>
              <Th>Procurement Year</Th>
              <Th>Custodian</Th>
            </Tr>
          </Thead>
          {loading ? (
            <Tbody>
              <Tr>
                <Td colSpan={5}>Loading...</Td>
              </Tr>
            </Tbody>
          ) : error ? (
            <Tbody>
              <Tr>
                <Td colSpan={5}>Error: {error}</Td>
              </Tr>
            </Tbody>
          ) : assets.length === 0 ? (
            <Tbody>
              <Tr>
                <Td colSpan={5}>No unassigned assets found</Td>
              </Tr>
            </Tbody>
          ) : (
            <Tbody>
              {assets.map((asset) => (
                <Tr key={asset.id}>
                  <Td>{asset.name}</Td>
                  <Td>{asset.type}</Td>
                  <Td>{asset.location}</Td>
                  <Td>{asset.procurementYear}</Td>
                  <Td>{asset.custodianEmail || 'N/A'}</Td>
                </Tr>
              ))}
            </Tbody>
          )}
        </Table>
      </TableContainer>
    </MainTemplate>
  );
}

export default UnassignedAssetsPage;

async function fetchUnassignedAssets(filters: { type?: string; custodian?: string; location?: string } = {}) {
  const query = new URLSearchParams(filters).toString();
  const response = await fetchGet('/api/asset/unassigned');
  if (response.ok) {
    const assets = await response.json();
    return assets.map((a: UnassignedAsset) => {
      return { ...a };
    });
  } else {
    throw new Error(
      'fetchUnassignedAssets Error:' + response.status + (await response.text())
    );
  }
}

