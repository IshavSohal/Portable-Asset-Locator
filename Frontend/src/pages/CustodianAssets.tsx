import { GcdsHeading, GcdsText } from '@cdssnc/gcds-components-react';

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react';

import { CustodianAssetCard } from '../components/CustodianAssetCard';
import MainTemplate from '../templates/MainTemplate';
import { useState, useEffect } from 'react';
import { CustodianAsset } from '../types';

function CustodianAssets() {
  return (
    <MainTemplate>
      <GcdsHeading tag="h1">Manage assets</GcdsHeading>
      <GcdsText textRole="secondary" size="caption" marginTop="400">
        These are assets that are under your custodianship.
      </GcdsText>
      <GcdsText size="caption">Showing {mockAssets.length} results.</GcdsText>
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
          <Tbody>
            {mockAssets.map((asset, index) => (
              <CustodianAssetCard key={index} asset={asset} />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </MainTemplate>
  );
}

export default CustodianAssets;

const mockAssets: CustodianAsset[] = [
  {
    id: 1,
    assetName: 'Laptop',
    assetTag: '1123',
    type: 'Laptop',
    location: 'Toronto',
    age: 10,
    dateOfPurchase: new Date('August 26, 2023'),
    assignedTo: 'Johndo@ec.gc.ca',
  },
  {
    id: 2,
    assetName: 'Mouse',
    assetTag: '1123',
    type: 'Laptop',
    location: 'Toronto',
    age: 3,
    assignedTo: null,
  },
  {
    id: 3,
    assetName: 'Headphone',
    assetTag: '1123',
    type: 'Laptop',
    location: 'Toronto',
    age: 6,
    assignedTo: 'Johndo@ec.gc.ca',
  },
  {
    id: 4,
    assetName: 'Headphone',
    assetTag: '1123',
    type: 'Laptop',
    location: 'Toronto',
    age: 3000,
    assignedTo: null,
  },
  {
    id: 5,
    assetName: 'Laptop',
    assetTag: '1123',
    type: 'Laptop',
    location: 'Toronto',
    age: 4,
    assignedTo: 'Johndo@ec.gc.ca',
  },
  {
    id: 1,
    assetName: 'Mouse',
    assetTag: '1123',
    type: 'Laptop',
    location: 'Toronto',
    age: 7,
    assignedTo: 'Johndo@ec.gc.ca',
  },
  {
    id: 1,
    assetName: 'Keyboard',
    assetTag: '1123',
    type: 'Laptop',
    location: 'Toronto',
    age: 9,
    assignedTo: 'Johndo@ec.gc.ca',
  },
  {
    id: 1,
    assetName: 'Monitor',
    assetTag: '1123',
    type: 'Laptop',
    location: 'Toronto',
    age: 7,
    assignedTo: 'Johndo@ec.gc.ca',
  },
  {
    id: 1,
    assetName: 'Laptop',
    assetTag: '1123',
    type: 'Laptop',
    location: 'Toronto',
    age: 76,
    assignedTo: 'Johndo@ec.gc.ca',
  },
  {
    id: 1,
    assetName: 'Monitor',
    assetTag: '1123',
    type: 'Laptop',
    location: 'Toronto',
    age: 120,
    assignedTo: 'Johndo@ec.gc.ca',
  },
  {
    id: 1,
    assetName: 'Laptop',
    assetTag: '1123',
    type: 'Laptop',
    location: 'Toronto',
    age: 30,
    assignedTo: 'Johndo@ec.gc.ca',
  },
];
