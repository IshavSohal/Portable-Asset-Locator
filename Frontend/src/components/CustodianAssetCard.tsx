import { GcdsLink } from '@cdssnc/gcds-components-react';

import { Tr, Td, Text } from '@chakra-ui/react';
import { CustodianAsset } from '../types';
import { calculateDateDiff } from '../utils';

interface CustodianAssetCardProps {
  asset: CustodianAsset;
}
export function CustodianAssetCard({ asset }: CustodianAssetCardProps) {
  return (
    <Tr style={{ textWrap: 'wrap' }}>
      <Td>
        <GcdsLink href={`/asset/${asset.id}`}>{asset.name}</GcdsLink>
      </Td>
      <Td>{asset.assetTag}</Td>
      <Td>{asset.type}</Td>
      <Td>{asset.location}</Td>
      <Td>
        {asset.dateOfPurchase
          ? calculateDateDiff(asset.dateOfPurchase, new Date(), 'years')
          : asset.age}
      </Td>
      <Td>
        {asset.assignedTo ? (
          asset.assignedTo
        ) : (
          <Text color="GrayText">None</Text>
        )}
      </Td>
    </Tr>
  );
}
