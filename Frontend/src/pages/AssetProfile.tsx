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
  ModalBody,
  ModalCloseButton,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { MdOutlineComment } from 'react-icons/md';
import { BsLaptop } from 'react-icons/bs';
import { GoTag } from 'react-icons/go';
import { useAuth } from '../hooks/AuthProvider';
import MainTemplate from '../templates/MainTemplate';
import { useParams } from 'react-router-dom';
import { fetchGet } from '../requests/requests';
import { useEffect, useState } from 'react';
import { dateFormatter } from '../utils';
import NotFound from './NotFound';
import AssignUserForm from '../components/AssignUserForm';
import UnassignUserForm from '../components/UnassignUserForm';
import { asset, assignment } from '../types/data';

function AssetProfile() {
  const { assetid } = useParams();
  let [asset, setAsset] = useState<asset>({
    id: 0,
    name: '',
    type: '',
    assetTag: '',
    custodian: {
      id: 0,
    },
  });
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [unassignModalOpen, setUnassignModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState<assignment | null>(
    null
  );
  const [currentAssignedUser, setCurrentAssignedUser] =
    useState<typeof user>(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    console.log('Fetching Asset Info');
    const getAsset = async () => {
      try {
        const response = await fetchGet(`/api/asset/${assetid}`);
        if (response.ok) {
          return await response.json();
        } else {
          // propagate Error so that it may be handled on frontend
          const { status } = response;
          throw new Error('loadUser Error:' + status + (await response.text()));
        }
      } catch (err) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    const getAssignment = async () => {
      const response = await fetchGet(`/api/assignment/asset/${assetid}`);
      if (response.ok) {
        // setIsLoading(false);
        return await response.json();
      } else {
        // propagate Error so that it may be handled on frontend
        setIsLoading(false);
        const { status } = response;
        throw new Error(
          'loadUser getAssignment Error:' + status + (await response.text())
        );
      }
    };

    const getCurrentUser = async (assignment: assignment | null) => {
      if (!assignment) {
        console.log('Get user failed!');
        setIsLoading(false);
        return null;
      }

      const response = await fetchGet(`/api/users/${assignment.assignee}`);

      if (response.ok) {
        setIsLoading(false);
        return await response.json();
      } else {
        // propagate Error so that it may be handled on frontend
        const { status } = response;
        throw new Error(
          'loadUser getAssignment Error:' + status + (await response.text())
        );
      }
    };

    getAsset()
      .then((res) => {
        console.log(res);
        setAsset(res);
        return getAssignment();
      })
      .then((res) => {
        console.log('Asset profile: current assignment', res);
        setCurrentAssignment(res);
        return getCurrentUser(res);
      })
      .then((res) => {
        console.log('Asset profile: Current user', res);
        setCurrentAssignedUser(res);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  const handleSuccessfulAssignment = (
    newUser: typeof user,
    assignment: assignment
  ) => {
    setAssignModalOpen(false);
    setSuccessMessage('User has been successfully assigned');
    setCurrentAssignedUser(newUser);
    setCurrentAssignment(assignment);
    setShowSuccess(true); // TODO: update message/sucess component
    // TODO: update the assignee so that it can be displayed on page (removed the "Assign user" button)
  };

  const handleSuccessfulUnassignment = () => {
    setUnassignModalOpen(false);
    setSuccessMessage('User has been successfully unassigned');
    setShowSuccess(true);
    setCurrentAssignedUser(null);
    setCurrentAssignment(null);
  };

  if (isLoading) {
    return (
      <MainTemplate currentPage="my-assets">
        <GcdsText style={{ paddingBottom: 10 }}> Loading... </GcdsText>
      </MainTemplate>
    );
  } else if (error) {
    return <NotFound />;
  }
  return (
    <MainTemplate currentPage="my-assets">
      <GcdsContainer style={{ marginBottom: 48 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <GcdsHeading tag="h1" marginBottom="0">
            {asset.name + ` (${asset.assetTag})`}
          </GcdsHeading>
          {!currentAssignment && user && user?.id === asset.custodian.id && (
            <GcdsContainer size="lg" margin="100">
              <GcdsButton onClick={() => setAssignModalOpen(true)}>
                Assign User
              </GcdsButton>
            </GcdsContainer>
          )}
        </div>
      </GcdsContainer>

      {showSuccess && (
        <Alert status="success" marginBottom={4}>
          <AlertIcon />
          {successMessage}
        </Alert>
      )}
      {currentAssignment && (
        <GcdsContainer
          style={{
            marginBottom: 50,
            marginTop: 50,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <GcdsText size="body" marginBottom="0">
              <strong>
                Assigned to {currentAssignedUser?.firstName}{' '}
                {currentAssignedUser?.lastName}
              </strong>{' '}
              ({currentAssignedUser?.email})
            </GcdsText>
            {user && user?.id === asset.custodian.id && (
              <GcdsButton
                onClick={() => setUnassignModalOpen(true)}
                style={{}}
                buttonRole="danger"
              >
                Unassign asset
              </GcdsButton>
            )}
          </div>
        </GcdsContainer>
      )}

      <Modal isOpen={assignModalOpen} onClose={() => setAssignModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Assign user to {asset.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AssignUserForm
              name={asset.name}
              tag={asset.assetTag}
              id={asset.id}
              onComplete={(user, assignment) =>
                handleSuccessfulAssignment(user, assignment)
              }
              onCancel={() => setAssignModalOpen(false)}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={unassignModalOpen}
        onClose={() => setUnassignModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Unassign asset?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <UnassignUserForm
              user={currentAssignedUser}
              asset={asset}
              assignment={currentAssignment}
              onComplete={() => handleSuccessfulUnassignment()}
              onCancel={() => setUnassignModalOpen(false)}
            />
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
              <div>
                {asset.dateOfPurchase &&
                  dateFormatter(asset.dateOfPurchase, true)}
              </div>
            </GcdsText>
            <GcdsText style={{ paddingRight: 10, maxWidth: 180 }}>
              <div style={{ fontWeight: 'bold' }}> Cost: </div>
              <div>{asset.cost ? '$' + asset.cost : 'N/A'}</div>
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
