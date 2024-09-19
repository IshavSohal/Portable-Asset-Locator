import { useState, useEffect } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Flex} from '@chakra-ui/react';
import { GcdsHeading, GcdsSelect, GcdsText, GcdsLink } from '@cdssnc/gcds-components-react';
import MainTemplate from '../templates/MainTemplate';
import { UnassignedAsset, Assettype, Locations, CustodianEmails} from '../types';
import { fetchGet } from '../requests/requests';

function UnassignedAssetsPage() {
    const [assetTypes, setAssetTypes] = useState<Assettype[]>([]);
    const [locationTypes, setLocationTypes] = useState<Locations[]>([]);
    const [custodianEmails, setCustodians] = useState<CustodianEmails[]>([]);
    const [assets, setAssets] = useState<UnassignedAsset[]>([]);
    const [filteredAssets, setFilteredAssets] = useState<UnassignedAsset[]>([]);
    const [error, setError] = useState<null | string>(null);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState<string | undefined>();
    const [selectedCustodian, setSelectedCustodian] = useState<string | undefined>(); 
    const [selectedLocation, setSelectedLocation] = useState<string | undefined>();

  useEffect(() => {
    const dataFetch = async () => {
      try {
        const assetTypesList = (await fetchAssetTypes()) as Assettype[];
        setAssetTypes(assetTypesList);
        const locationsList = (await fetchLocations()) as Locations[];
        setLocationTypes(locationsList);
        const CustodiansList = (await fetchCustodians()) as CustodianEmails[];
        setCustodians(CustodiansList);
        const assetsList = (await fetchUnassignedAssets()) as UnassignedAsset[];
        setAssets(assetsList);
        setFilteredAssets(assetsList);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    dataFetch();
  }, []);

  useEffect(() => {
    const filtered = assets.filter(asset => {
      const matchesType = selectedType ? asset.type === selectedType : true;
      const matchesCustodian = selectedCustodian ? asset.custodianEmail === selectedCustodian : true;
      const matchesLocation = selectedLocation ? asset.location === selectedLocation : true;
      return matchesType && matchesCustodian && matchesLocation;
    });
    setFilteredAssets(filtered);
  }, [selectedType, selectedCustodian, selectedLocation, assets]);

  const extractProcurementYear = (dateOfPurchase?: Date | null): number | 'N/A' => {
    if (!dateOfPurchase) return 'N/A';
    const year = new Date(dateOfPurchase).getFullYear();
    return year;
};

  return (
    <MainTemplate currentPage="unassigned-assets">
      <GcdsHeading tag="h1">Unassigned Assets</GcdsHeading>
      <GcdsHeading tag="h5">List of all assets</GcdsHeading>
      <GcdsText textRole="secondary" size="caption" marginTop="400">
        There are assets that are not currently assigned and can be requested. Select an asset to see more details and make a request.
      </GcdsText>
      <GcdsHeading tag="h5">Filters</GcdsHeading>
      {loading ? (
                <GcdsText>Loading filters...</GcdsText>
            ) : (
      <Flex style={{gap: '30px'}}>
      <GcdsSelect
          selectId="asset-type-select"
          label="Asset Type"
          name="assettype"
          value={selectedType}
          onGcdsChange={e => setSelectedType(e.detail)}
        >
          <option value="" >Select a Type</option>
          {assetTypes.map((assettype) => (
            <option key={assettype.id}>
              {assettype.type}
            </option>
          ))}
        </GcdsSelect>
        <GcdsSelect
          selectId="custodian-select"
          label="Custodian"
          name="custodianEmail"
          defaultValue=""
          value={selectedCustodian}
          onGcdsChange={e => setSelectedCustodian(e.detail)}
        >
          <option value="">Select a Custodian</option>
          {custodianEmails.map((custodian) => (
            <option key={custodian.UID}>
              {custodian.email}
            </option>
          ))}
        </GcdsSelect>
        <GcdsSelect
          selectId="location-select"
          label="Location"
          name="assetLocation"
          defaultValue=""
          value={selectedLocation}
          onGcdsChange={e => setSelectedLocation(e.detail)}
        >
          <option value="">Select a Location</option>
          {locationTypes.map(assetLocation => (
            <option key={assetLocation.id.toString()}>
              {assetLocation.location}
            </option>
          ))}
        </GcdsSelect>
      </Flex>
      )}
      <GcdsText size="caption">Showing {filteredAssets.length} entries.</GcdsText>
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
              {filteredAssets.map((asset) => (
                <Tr key={asset.id}>
                  <Td><GcdsLink href={`/assets/${asset.id}`}>
                        {asset.name}
                  </GcdsLink></Td>
                  <Td>{asset.type}</Td>
                  <Td>{asset.location}</Td>
                  <Td>{extractProcurementYear(asset.dateOfPurchase)}</Td>
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

async function fetchAssetTypes () {
  const response = await fetchGet('/api/asset/unassigned/types');
  if (response.ok) {
    const assettypes = await response.json();
    return assettypes.map((t: Assettype) => {
      return { ...t };
    });
  } else {
    throw new Error(
      'fetchAssetTypes Error:' + response.status + (await response.text())
    );
  }
}

async function fetchLocations(): Promise<Locations[]> {
  const response = await fetchGet('/api/asset/unassigned/locations');
  if (response.ok) {
    const locations = await response.json();
    return locations.map((l: Location) => ({ ...l }));
  } else {
    throw new Error(
      'fetchLocations Error:' + response.status + (await response.text())
    );
  }
}

async function fetchCustodians(): Promise<CustodianEmails[]> {
  const response = await fetchGet('/api/asset/unassigned/custodians');
  if (response.ok) {
    const custodians = await response.json();
    return custodians.map((c: CustodianEmails) => ({ ...c }));
  } else {
    throw new Error(
      'fetchCustodians Error:' + response.status + (await response.text())
    );
  }
}

async function fetchUnassignedAssets() {
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






