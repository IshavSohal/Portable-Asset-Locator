import {
  GcdsButton,
  GcdsContainer,
  GcdsDateModified,
  GcdsGrid,
  GcdsHeading,
  GcdsText,
} from '@cdssnc/gcds-components-react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { MdOutlineComment } from 'react-icons/md';
import { BsLaptop } from 'react-icons/bs';
import { GoTag } from 'react-icons/go';

import MainTemplate from '../templates/MainTemplate';
import { useParams } from 'react-router-dom';
import { fetchGet } from '../requests/requests';
import { useEffect, useState } from 'react';
import { dateFormatter } from '../utils';
import AssignUserForm from '../components/AssignUserForm';

function AssetProfile() {
  const { assetid } = useParams();
  let [asset, setAsset] = useState({
    id: null,
    name: null,
    type: null,
    make: null,
    assetTag: null,
    serialNumber: null,
    description: null,
    location: null,
    warrantyStartDate: null,
    warrantyEndDate: null,
    warrantyDetails: null,
    dateOfPurchase: null,
    cost: null,
    purchaser: null,
    comment: null,
    model: null,
    custodian: {
      id: null,
      firstName: null,
      lastName: null,
      email: null,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    console.log('Fetching Asset Info');
    const getAsset = async () => {
      const response = await fetchGet(`/api/asset/${assetid}`);
      if (response.ok) {
        setIsLoading(false);
        return await response.json();
      } else {
        // propagate Error so that it may be handled on frontend
        const { status } = response;
        throw new Error('loadUser Error:' + status + (await response.text()));
      }
    };

    getAsset().then((res) => {
      setAsset(res);
    });
  }, []);

  if (isLoading) {
    return (
      <MainTemplate currentPage="my-assets">
        <GcdsText style={{ paddingBottom: 10 }}> Loading... </GcdsText>
      </MainTemplate>
    );
  }
  return (
    <MainTemplate currentPage="my-assets">
      <GcdsHeading tag="h1" style={{ marginBottom: 48 }}>
        {asset.name + ` (${asset.assetTag})`}
      </GcdsHeading>
      <GcdsButton onClick={() => setModalOpen(true)}>Assign User</GcdsButton>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AssignUserForm name="name" tag="A12345" />
          </ModalBody>
        </ModalContent>
      </Modal>
      <GcdsGrid
        columns="minmax(100px, 900px) minmax(100px, 250px)"
        justifyContent="space-between"
      >
        <GcdsContainer size="lg" border>
          <GcdsText style={{ paddingTop: 20, paddingLeft: 20 }}>
            <BsLaptop style={{ paddingRight: 5 }} />
            <strong> Asset Details </strong>
          </GcdsText>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              paddingLeft: 20,
            }}
          >
            <GcdsText style={{ paddingRight: 10, maxWidth: 180 }}>
              <div style={{ fontWeight: 'bold' }}> Asset name: </div>
              <div>{asset.name ?? 'N/A'}</div>
              <div style={{ fontWeight: 'bold', paddingTop: 20 }}>
                {' '}
                Serial number:{' '}
              </div>
              <div>{asset.serialNumber ?? 'N/A'}</div>
            </GcdsText>
            <GcdsText style={{ paddingRight: 10, maxWidth: 180 }}>
              <div style={{ fontWeight: 'bold' }}> Asset tag: </div>
              <div>{asset.assetTag ?? 'N/A'}</div>
              <div style={{ fontWeight: 'bold', paddingTop: 20 }}> Type: </div>
              <div>{asset.type ?? 'N/A'}</div>
            </GcdsText>
            <GcdsText style={{ paddingRight: 10, maxWidth: 180 }}>
              <div style={{ fontWeight: 'bold' }}> Asset custodian: </div>
              <div>
                {asset.custodian.firstName && asset.custodian.lastName
                  ? asset.custodian.firstName + ' ' + asset.custodian.lastName
                  : 'N/A'}
              </div>
              <div style={{ fontWeight: 'bold', paddingTop: 20 }}> Make: </div>
              <div>{asset.make ?? 'N/A'}</div>
            </GcdsText>
            <GcdsText style={{ paddingRight: 10, maxWidth: 180 }}>
              <div style={{ fontWeight: 'bold' }}> Asset location: </div>
              <div>{asset.location ?? 'N/A'}</div>
              <div style={{ fontWeight: 'bold', paddingTop: 20 }}> Model: </div>
              <div>{asset.model ?? 'N/A'}</div>
            </GcdsText>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              paddingLeft: 20,
            }}
          >
            <GcdsText>
              <div style={{ fontWeight: 'bold' }}> Asset description: </div>
              <div>{asset.description ?? 'N/A'}</div>
            </GcdsText>
          </div>
        </GcdsContainer>

        <GcdsContainer size="xs" border>
          <GcdsText style={{ paddingTop: 20, paddingLeft: 20 }}>
            <MdOutlineComment style={{ paddingRight: 5 }} />
            <strong> Comments </strong>
          </GcdsText>
          <GcdsText
            style={{
              overflowWrap: 'break-word',
              padding: '0px 20px',
              paddingLeft: 20,
            }}
          >
            {asset.comment ?? 'N/A'}
          </GcdsText>
        </GcdsContainer>
      </GcdsGrid>

      <GcdsGrid
        columns="minmax(100px, 900px) minmax(100px, 250px)"
        justifyContent="space-between"
        style={{ marginTop: 60 }}
      >
        <GcdsContainer size="lg" style={{ background: '#F1F2F3' }}>
          <GcdsText style={{ marginTop: 20, marginLeft: 20 }}>
            <GoTag style={{ paddingRight: 5 }} />
            <strong> Asset details </strong>
          </GcdsText>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              paddingLeft: 20,
            }}
          >
            <GcdsText style={{ paddingRight: 10, maxWidth: 180 }}>
              <div style={{ fontWeight: 'bold' }}> Date of purchase: </div>
              <div>{dateFormatter(asset.dateOfPurchase, true)}</div>
            </GcdsText>
            <GcdsText style={{ paddingRight: 10, maxWidth: 180 }}>
              <div style={{ fontWeight: 'bold' }}> Cost: </div>
              <div>
                {asset.cost && asset.cost !== 'N/A' ? '$' + asset.cost : 'N/A'}
              </div>
            </GcdsText>
            <GcdsText style={{ paddingRight: 10, maxWidth: 180 }}>
              <div style={{ fontWeight: 'bold' }}> Purchaser: </div>
              <div>{asset.purchaser ?? 'N/A'}</div>
            </GcdsText>
            <GcdsText style={{ paddingRight: 20, maxWidth: 200 }}>
              <div style={{ fontWeight: 'bold' }}> Warranty period: </div>
              <div>
                {asset.warrantyStartDate && asset.warrantyEndDate
                  ? dateFormatter(asset.warrantyStartDate, true) +
                    ' to ' +
                    dateFormatter(asset.warrantyEndDate, true)
                  : 'N/A'}
              </div>
            </GcdsText>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              paddingLeft: 20,
            }}
          >
            <GcdsText>
              <div style={{ fontWeight: 'bold' }}> Warranty details: </div>
              <div>{asset.warrantyDetails ?? 'N/A'}</div>
            </GcdsText>
          </div>
        </GcdsContainer>
      </GcdsGrid>

      <GcdsContainer size="xl" centered style={{ paddingBottom: 10 }}>
        <GcdsDateModified> 2024-08-07 </GcdsDateModified>
      </GcdsContainer>
    </MainTemplate>
  );
}

export default AssetProfile;
