import { GcdsContainer, GcdsHeading, GcdsText } from '@cdssnc/gcds-components-react';
import { 
  Table, 
  TableContainer, 
  TabList,
  TabPanel,
  TabPanels, 
  Tabs, 
  Tab, 
  Thead, 
  Tbody, 
  Tr, 
  Td, 
  Th 
} from '@chakra-ui/react';

import { CustodianAssetCard } from '../components/CustodianAssetCard';
import MainTemplate from '../templates/MainTemplate';
import { useState, useEffect, SyntheticEvent, ReactNode } from 'react';
import { CustodianAsset, Request } from '../types';
import { fetchGet } from '../requests/requests';
import { dateFormatter } from '../utils/DateUtils'
import { useAuth } from '../hooks/AuthProvider';

function ManageAssetsPage() {
  const [assets, setAssets] = useState<CustodianAsset[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Request[]>([]);
  const [resolvedRequests, setResolvedRequests] = useState<Request[]>([]);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      try {
        const assetsList = (await fetchUserAssets()) as CustodianAsset[];
        const requestList = (await fetchRequests()) as Request[];
        setPendingRequests(requestList.filter((request) => 
          request.requestStatusName === 'Pending' && request.asset.custodian === user!.id ));
        setResolvedRequests(requestList.filter((request) => 
          request.requestStatusName !== 'Pending' && request.asset.custodian === user!.id ));
        setAssets(assetsList); ;
        // filter requests into two different arrays
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    dataFetch();
  }, []);

  return (
    <MainTemplate currentPage="manage-assets">

      <GcdsHeading tag="h1">Manage assets</GcdsHeading>
      <GcdsText> These are requests for assets that are under your custodianship</GcdsText>

      <Tabs style={{}} defaultIndex={0} position='relative' variant='unstyled'>
        <TabList>
          <Tab 
            _selected={{borderBottom: 'solid 2px #2196F3', color: "#2196F3"}} 
            style={{padding: "10px", fontSize: "20px"}}
          >
            Team Assets
          </Tab>
          <Tab 
            _selected={{borderBottom: 'solid 2px #2196F3', color: "#2196F3"}} 
            style={{padding: "10px", fontSize: "20px"}}
          >
            Asset Requests
          </Tab>
        </TabList>
        {/* <TabIndicator mt='-1.5px' height='2px' bg='blue.500' borderRadius='1px' /> */}

        <TabPanels>
          <TabPanel>
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
          </TabPanel>

          <TabPanel>
            <GcdsContainer size="xl">
              <GcdsText marginTop="400" > List of pending asset requests </GcdsText>
              <GcdsText textRole="secondary" size="caption">
                These are requests for assets that are under your custodianship
              </GcdsText>
              <TableContainer>
                <Table
                  variant="striped"
                  colorScheme="blackAlpha"
                  size="lg"
                  marginBottom="100"
                >
                  <Thead>
                    <Tr>
                      <Th>Request ID</Th>
                      <Th>Requested on</Th>
                      <Th>Requested by</Th>
                      <Th>Asset requested</Th>
                      <Th>Asset type</Th>
                    </Tr>
                  </Thead>
                  {loading ? (
                    <Tbody>Loading...</Tbody>
                  ) : error ? (
                    <Tbody>Error: {error}</Tbody>
                  ) : pendingRequests.length === 0 ? (
                    <Tbody>No pending requests</Tbody>
                  ) : (
                    <Tbody>
                      {pendingRequests.map((request) => (
                            <Tr style={{ textWrap: 'wrap' }}>
                              <Td>{request.id}</Td>
                              <Td>{dateFormatter(request.startDate)}</Td>
                              <Td>{request.requestor.email}</Td>
                              <Td>{request.asset.name}</Td>
                              <Td>{request.asset.type}</Td>
                          </Tr>
                      ))}
                    </Tbody>
                  )}
                </Table>
              </TableContainer>
            </GcdsContainer>

            <GcdsContainer size="xl">
              <GcdsText> Asset request history </GcdsText>
              <GcdsText textRole="secondary" size="caption">
                This is a history of the requests that have been made for the assets under your custodianship
              </GcdsText>
              <TableContainer>
                <Table
                  variant="striped"
                  colorScheme="blackAlpha"
                  size="lg"
                  marginBottom="100"
                >
                  <Thead>
                    <Tr>
                      <Th>Request ID</Th>
                      <Th>Requested on</Th>
                      <Th>Requested by</Th>
                      <Th>Asset requested</Th>
                      <Th>Asset type</Th>
                      <Th>Status</Th>
                    </Tr>
                  </Thead>
                  {loading ? (
                    <Tbody>Loading...</Tbody>
                  ) : error ? (
                    <Tbody>Error: {error}</Tbody>
                  ) : mockResolvedReqs.length === 0 ? (
                    <Tbody>No resolved requests</Tbody>
                  ) : (
                    <Tbody>
                      {mockResolvedReqs.map((request) => (
                            <Tr style={{ textWrap: 'wrap' }}>
                              <Td>{request.id}</Td>
                              <Td>{dateFormatter(request.startDate)}</Td>
                              <Td>{request.requestor.email}</Td>
                              <Td>{request.asset.name}</Td>
                              <Td>{request.asset.type}</Td>
                              <Td>{request.requestStatusName}</Td>
                          </Tr>
                      ))}
                    </Tbody>
                  )}
                </Table>
              </TableContainer>
            </GcdsContainer>
          </TabPanel>
        </TabPanels>
      </Tabs>

    </MainTemplate>
  );
}

export default ManageAssetsPage;

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


async function fetchRequests() {
  const response = await fetchGet('/api/request');
  if (response.ok) { 
    return await response.json();;
  } else {
    throw new Error(
      'fetchRequests Error:' + response.status + (await response.text())
    );
  }
}


const mockResolvedReqs = [
  {
      id: 33,
      requestor: {
          UID: 11,
          email: 'jenny.zhang@ec.gc.ca',
          firstName: 'JennyTest',
          lastName: 'Zhang',
          roleName: 'Base'
      },
      assignee: {
          UID: 134,
          email: 'test33@ec.gc.ca',
          firstName: 'Jenny',
          lastName: 'Zhang',
          roleName: 'Base'
      },
      asset: {
          id: 34,
          name: 'Inspiron 15 Laptop in Toronto Custodian Entered',
          type: 'Laptop',
          make: null,
          model: null,
          assetTag: 'A11111',
          serialNumber: null,
          description: null,
          custodian: 116,
          location: 'Toronto',
          warrantyStartDate: null,
          warrantyEndDate: null,
          warrantyDetails: null,
          dateOfPurchase: null,
          cost: null,
          purchaser: 'Jenny',
          comment: null
      },
      requestStatusName: 'Approved',
      startDate: '2028-10-10T05:48:00.000Z',
      notes: null
  },
  {
      id: 34,
      requestor: {
          UID: 11,
          email: 'jenny.zhang@ec.gc.ca',
          firstName: 'JennyTest',
          lastName: 'Zhang',
          roleName: 'Base'
      },
      assignee: {
          UID: 5,
          email: 'custodian@ec.gc.ca',
          firstName: 'John',
          lastName: 'Smith',
          roleName: 'Custodian'
      },
      asset: {
          id: 31,
          name: 'Inspiron 15 Laptop',
          type: 'Laptop',
          make: null,
          model: 'Test',
          assetTag: 'A23453',
          serialNumber: null,
          description: null,
          custodian: 116,
          location: 'Toronto',
          warrantyStartDate: null,
          warrantyEndDate: null,
          warrantyDetails: null,
          dateOfPurchase: null,
          cost: null,
          purchaser: null,
          comment: null
      },
      requestStatusName: 'Cancelled',
      startDate: '2028-10-10T05:48:00.000Z',
      notes: null
  },
  {
      id: 35,
      requestor: {
          UID: 101,
          email: 'newUser@ec.gc.ca',
          firstName: 'firstName',
          lastName: 'lastName',
          roleName: 'Base'
      },
      assignee: {
          UID: 22,
          email: 'hello@ec.gc.ca',
          firstName: 'first',
          lastName: 'last',
          roleName: 'Base'
      },
      asset: {
          id: 35,
          name: 'Inspiron 15 Laptop in Toronto Custodian Entered',
          type: 'Laptop',
          make: null,
          model: null,
          assetTag: 'A11111',
          serialNumber: null,
          description: null,
          custodian: 116,
          location: 'Toronto',
          warrantyStartDate: null,
          warrantyEndDate: null,
          warrantyDetails: null,
          dateOfPurchase: null,
          cost: null,
          purchaser: 'Declined',
          comment: null
      },
      requestStatusName: 'Pending',
      startDate: '2028-10-10T05:48:00.000Z',
      notes: null
  },
  {
      id: 36,
      requestor: {
          UID: 101,
          email: 'newUser@ec.gc.ca',
          firstName: 'firstName',
          lastName: 'lastName',
          roleName: 'Base'
      },
      assignee: {
          UID: 22,
          email: 'hello@ec.gc.ca',
          firstName: 'first',
          lastName: 'last',
          roleName: 'Base'
      },
      asset: {
          id: 41,
          name: 'Inspiron 15 Laptop in Toronto Custodian Entered New Sept 10',
          type: 'Laptop',
          make: null,
          model: null,
          assetTag: 'A11111',
          serialNumber: null,
          description: null,
          custodian: 116,
          location: 'Toronto',
          warrantyStartDate: null,
          warrantyEndDate: null,
          warrantyDetails: null,
          dateOfPurchase: null,
          cost: null,
          purchaser: 'Resolved',
          comment: null
      },
      requestStatusName: 'Approved',
      startDate: '2028-10-10T05:48:00.000Z',
      notes: null
  }
];

// const mockAssets: CustodianAsset[] = [
//   {
//     id: 1,
//     name: 'Laptop',
//     assetTag: '1123',
//     type: 'Laptop',
//     location: 'Toronto',
//     age: 10,
//     dateOfPurchase: new Date('August 26, 2023'),
//     assignedTo: 'Johndo@ec.gc.ca',
//   },
//   {
//     id: 2,
//     name: 'Mouse',
//     assetTag: '1123',
//     type: 'Laptop',
//     location: 'Toronto',
//     age: 3,
//     assignedTo: null,
//   },
//   {
//     id: 3,
//     name: 'Headphone',
//     assetTag: '1123',
//     type: 'Laptop',
//     location: 'Toronto',
//     age: 6,
//     assignedTo: 'Johndo@ec.gc.ca',
//   },
//   {
//     id: 4,
//     name: 'Headphone',
//     assetTag: '1123',
//     type: 'Laptop',
//     location: 'Toronto',
//     age: 3000,
//     assignedTo: null,
//   },
//   {
//     id: 5,
//     name: 'Laptop',
//     assetTag: '1123',
//     type: 'Laptop',
//     location: 'Toronto',
//     age: 4,
//     assignedTo: 'Johndo@ec.gc.ca',
//   },
//   {
//     id: 1,
//     name: 'Mouse',
//     assetTag: '1123',
//     type: 'Laptop',
//     location: 'Toronto',
//     age: 7,
//     assignedTo: 'Johndo@ec.gc.ca',
//   },
//   {
//     id: 1,
//     name: 'Keyboard',
//     assetTag: '1123',
//     type: 'Laptop',
//     location: 'Toronto',
//     age: 9,
//     assignedTo: 'Johndo@ec.gc.ca',
//   },
//   {
//     id: 1,
//     name: 'Monitor',
//     assetTag: '1123',
//     type: 'Laptop',
//     location: 'Toronto',
//     age: 7,
//     assignedTo: 'Johndo@ec.gc.ca',
//   },
//   {
//     id: 1,
//     name: 'Laptop',
//     assetTag: '1123',
//     type: 'Laptop',
//     location: 'Toronto',
//     age: 76,
//     assignedTo: 'Johndo@ec.gc.ca',
//   },
//   {
//     id: 1,
//     name: 'Monitor',
//     assetTag: '1123',
//     type: 'Laptop',
//     location: 'Toronto',
//     age: 120,
//     assignedTo: 'Johndo@ec.gc.ca',
//   },
//   {
//     id: 1,
//     name: 'Laptop',
//     assetTag: '1123',
//     type: 'Laptop',
//     location: 'Toronto',
//     age: 30,
//     assignedTo: 'Johndo@ec.gc.ca',
//   },
// ];
