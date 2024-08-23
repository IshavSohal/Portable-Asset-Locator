import {
    GcdsHeading,
    GcdsText,
  } from "@cdssnc/gcds-components-react";

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
  } from '@chakra-ui/react'

import {CustodianAssetCard} from "../components/CustodianAssetCard"
import MainTemplate from "../templates/MainTemplate";
import { useState, useEffect } from "react";
import { CustodianAsset } from '../types'

const mockAssets: CustodianAsset[] = [
    { assetName: 'Laptop', assetTag: 1, type: 'Laptop', location: 'Toronto', age: 10, assignedTo: 'Johndo@ec.gc.ca' },
    { assetName: 'Mouse', assetTag: 2, type: 'Laptop', location: 'Toronto', age: 3, assignedTo: 'Johndo@ec.gc.ca' },
    { assetName: 'Headphone', assetTag: 3, type: 'Laptop', location: 'Toronto', age: 6, assignedTo: 'Johndo@ec.gc.ca' },
    { assetName: 'Headphone', assetTag: 4, type: 'Laptop', location: 'Toronto', age: 3000, assignedTo: 'Johndo@ec.gc.ca' },
    { assetName: 'Laptop', assetTag: 5, type: 'Laptop', location: 'Toronto', age: 4, assignedTo: 'Johndo@ec.gc.ca' },
    { assetName: 'Mouse', assetTag: 6, type: 'Laptop', location: 'Toronto', age: 7, assignedTo: 'Johndo@ec.gc.ca' },
    { assetName: 'Keyboard', assetTag: 7, type: 'Laptop', location: 'Toronto', age: 9, assignedTo: 'Johndo@ec.gc.ca' },
    { assetName: 'Monitor', assetTag: 8, type: 'Laptop', location: 'Toronto', age: 7, assignedTo: 'Johndo@ec.gc.ca' },
    { assetName: 'Laptop', assetTag: 9, type: 'Laptop', location: 'Toronto', age: 76, assignedTo: 'Johndo@ec.gc.ca' },
    { assetName: 'Monitor', assetTag: 10, type: 'Laptop', location: 'Toronto', age: 120, assignedTo: 'Johndo@ec.gc.ca' },
    { assetName: 'Laptop', assetTag: 11, type: 'Laptop', location: 'Toronto', age: 30, assignedTo: 'Johndo@ec.gc.ca' },
  ];
function CustodianAssets(){
    
    return <MainTemplate>
      <GcdsHeading tag="h1">
        Manage assets
      </GcdsHeading>
      <GcdsText size="caption" marginBottom="500">
        List of team assets
      </GcdsText>
      <GcdsText textRole="secondary" size="caption" marginBottom="500" marginTop="400">
        These are assets that are under your custodianship
      </GcdsText>
      
      <TableContainer>
        <Table variant='striped' colorScheme="blackAlpha" size='lg'>
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
              <CustodianAssetCard key={index} asset={asset}/>
            ))}   
          </Tbody>
     
        </Table>
      </TableContainer>

    </MainTemplate>
}

export default CustodianAssets;