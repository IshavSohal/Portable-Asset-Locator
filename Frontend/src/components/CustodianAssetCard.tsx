import {
    GcdsButton,
    GcdsContainer,
    GcdsDateModified,
    GcdsHeading,
    GcdsInput,
    GcdsGrid,
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
import { CustodianAsset } from '../types'

interface CustodianAssetCardProps{
  asset: CustodianAsset;
}
export function CustodianAssetCard({asset}: CustodianAssetCardProps){
    return (
      <Tr>

          <Td>{asset.assetName}</Td>
          <Td>{asset.assetTag}</Td>
          <Td>{asset.type}</Td>
          <Td>{asset.location}</Td>
          <Td>{asset.age}</Td>
          <Td>{asset.assignedTo}</Td>

      </Tr>

    )
}
