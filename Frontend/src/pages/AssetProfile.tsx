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
  AlertDescription,
  AlertTitle,
  Box,
  CloseButton
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
import RequestAssetForm from '../components/RequestAssetForm';
import CancelRequestForm from  '../components/CancelRequestForm';
import { asset, request, userAlt } from '../types/data';

const SUCCESS_MSG_ASSIGN = 'User has been successfully assigned';

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
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [cancelRequestModalOpen, setCancelRequestModalOpen] = useState(false);
  const [showAssignSuccess, setShowAssignSuccess] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [cancelRequestSuccess, setCancelRequestSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [pendingRequest, setPendingRequest] = useState<request | null>(null);
  const [cancelledRequest, setCancelledRequest] = useState<request | null>(null);
  const [unassigned, setUnassigned] = useState(true);
  const [assetRequestor, setAssetRequestor] = useState<userAlt | null>(null);
  const [pendingRequestAlert, setPendingRequestAlert] = useState(true);
  const [cancelRequestAlert, setCancelRequestAlert] = useState(false);

  // TODO: display the current assignee if the asset is not unassiged
  //const [assetAssignee, setAssetAssignee] = useState<userAlt | null>(null);


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

    const getRequests = async() => {
      try{
        const response = await fetchGet(`/api/request/assetRequests/${assetid}`)
        if (response.ok) {
          return await response.json();
        } else {
          // propagate Error so that it may be handled on frontend
          const { status } = response;
          throw new Error('loadUser Error:' + status + (await response.text()));
        }
      } catch (err) {
        console.log(err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    const getUnassigned = async() => {
      try{
        const response = await fetchGet(`/api/asset/unassigned`)
        if (response.ok) {
          return await response.json();
        } else {
          // propagate Error so that it may be handled on frontend
          const { status } = response;
          throw new Error('loadUser Error:' + status + (await response.text()));
        }
      } catch (err) {
        console.log(err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    getAsset().then((res) => {
      const theAsset = !!res ? JSON.parse(JSON.stringify(res)) : null;
      setAsset(theAsset);
      
      // Check if this asset is within the list of unassigned assets
      if(!!theAsset){
        getUnassigned().then((res) => {
          let isUnassigned = false;
          if (res.length >= 1){
            isUnassigned = !!(res.find((a: any) => a.id === theAsset.id));
          } 
          setUnassigned(isUnassigned);
        });
      }
    });

    getRequests().then((res) => {
      let thePendingRequest = null

      if (res.length >= 1){
        for (let req of res){
          if (req.requestStatusName === 'Pending'){
            thePendingRequest = JSON.parse(JSON.stringify(req));
            break;
          }
        }
      } 
      setPendingRequest(thePendingRequest);

      // Obtain the asset requestor if there is a pending request
      if (!!thePendingRequest){
        getUserById(thePendingRequest.requestor).then((requestor)=> {
          setAssetRequestor(requestor);
        }); 
      }
    });
  }, [requestSuccess, cancelRequestSuccess]); // retrieve state values again upon successful request or cancelled request

  const handleSuccessfulAssignment = () => {
    setAssignModalOpen(false);
    setShowAssignSuccess(true); // TODO: update message/sucess component
    // TODO: update the assignee so that it can be displayed on page (removed the "Assign user" button)
  };

  const handleSuccessfulRequest = () => {
    setRequestModalOpen(false);
    setRequestSuccess(true);
    setPendingRequestAlert(true);
    setCancelRequestAlert(false);
  }

  const handleSuccessfulRequestCancel = () => {
    if (!!pendingRequest){
      setCancelledRequest(JSON.parse(JSON.stringify(pendingRequest)));
    }
    setCancelRequestModalOpen(false);
    setCancelRequestSuccess(true);
    setCancelRequestAlert(true);
    setPendingRequestAlert(false);
  }

  const getUserById = async (userID: number) => {
    const response = await fetchGet(`/api/users/${userID}`);
  
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(
        'getUserById Error:' + response.status + (await response.text())
      );
    }
  }

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

      <div style={{display: "flex", justifyContent: 'flex-end'}}>
        <GcdsHeading tag="h1" style={{ marginBottom: 48, marginRight: "auto" }}>
          {asset.name + ` (${asset.assetTag})`}
        </GcdsHeading>

        {user && user?.id === asset.custodian.id && !pendingRequest && unassigned && (
          <GcdsContainer size="lg" margin="100">
            <GcdsButton onClick={() => setAssignModalOpen(true)}>
              Assign User
            </GcdsButton>
          </GcdsContainer>
        )}
        <Modal isOpen={assignModalOpen} onClose={() => setAssignModalOpen(false)} size={'xl'}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Assign user to {asset.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <AssignUserForm
                name={asset.name}
                tag={asset.assetTag}
                id={asset.id}
                onComplete={() => handleSuccessfulAssignment()}
                onCancel={() => setAssignModalOpen(false)}
              />
            </ModalBody>
          </ModalContent>
        </Modal>

        {user && user?.id !== asset.custodian.id && !pendingRequest && unassigned && (
          <GcdsContainer size="lg" margin="100">
            <GcdsButton onClick={() => setRequestModalOpen(true)}>
              Request Asset
            </GcdsButton>
          </GcdsContainer>
        )}
        <Modal isOpen={requestModalOpen} onClose={() => setRequestModalOpen(false)} size={'xl'}>
          <ModalOverlay/>
          <ModalContent>
            <ModalHeader>Request Asset</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <RequestAssetForm
                name={asset.name}
                tag={asset.assetTag}
                id={asset.id}
                onComplete={() => handleSuccessfulRequest()}
                onCancel={() => setRequestModalOpen(false)}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </div>

      {!!pendingRequest && pendingRequestAlert && !cancelRequestAlert && (
      <Alert status='info' marginBottom={4} style={{display: 'flex', justifyContent: 'space-between'}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <AlertIcon />
          <Box>
            <AlertTitle>Request Under Review</AlertTitle>
            <AlertDescription>
                This asset is no longer assessible for other employees to request<br/>
                Request ID: {pendingRequest.id}<br/>
                Asset requested by: {assetRequestor 
                ? assetRequestor.firstName + " " + assetRequestor.lastName + " (" + assetRequestor.email + ")"
                : 'N/A'} <br/>
                Requested on: {dateFormatter(pendingRequest.startDate.toString())} <br/>
                <button 
                  style={{color: 'blue', textDecoration: 'underline'}}
                  onClick={() => {console.log('show request history');}}
                >
                  View Request History
                </button>
            </AlertDescription>
          </Box>
        </div>
        <button 
          style={{alignSelf: 'flex-end', color: 'blue', textDecoration: 'underline', visibility: pendingRequest?.requestor === user?.id || user?.role === 'Custodian' ? 'visible' : 'hidden'}}
          onClick={() => setCancelRequestModalOpen(true)}
        >
          Cancel Request
        </button>
        <CloseButton
          alignSelf='flex-start'
          position='relative'
          right={-1}
          top={-1}
          onClick={() => setPendingRequestAlert(false)}
        />
      </Alert>
      )}

      {!!pendingRequest && (
        <Modal isOpen={cancelRequestModalOpen} onClose={() => setCancelRequestModalOpen(false)} size={'xl'}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>Cancel Asset Request</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CancelRequestForm
              name={asset.name}
              tag={asset.assetTag}
              requestid={pendingRequest.id}
              onComplete={() => handleSuccessfulRequestCancel()}
              onCancel={() => setCancelRequestModalOpen(false)}
            />
          </ModalBody>
        </ModalContent>
      </Modal>)}

      {/* TODO: obtain assignee's info and display */}
      {!unassigned && (
      <Alert status="info" marginBottom={4}>
        <div style={{display: 'flex', flexDirection: "column"}}>
          <div style={{display: 'flex'}}>
            <AlertIcon />
            <div style={{ fontSize: 20, marginLeft: 8}}>This asset is already assigned</div>
          </div>
        </div>
      </Alert>
      )}

      {showAssignSuccess && (
        <Alert status="success" marginBottom={4}>
          <AlertIcon />
          {SUCCESS_MSG_ASSIGN}
        </Alert>
      )}

      {cancelRequestAlert && !!cancelledRequest && !pendingRequestAlert && (
      <Alert status="warning" marginBottom={4} style={{display: 'flex', justifyContent: 'space-between'}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <AlertIcon />
          <Box>
            <AlertTitle>Request Cancelled</AlertTitle>
            <AlertDescription>
                Request ID: {cancelledRequest.id}<br/>
                Asset requested by: {assetRequestor 
                ? assetRequestor.firstName + " " + assetRequestor.lastName + " (" + assetRequestor.email + ")"
                : 'N/A'} <br/>
                <button 
                  style={{color: 'blue', textDecoration: 'underline'}}
                  onClick={() => {console.log('show request history');}}
                >
                  View Request History
                </button>
            </AlertDescription>
          </Box>
        </div>
        <CloseButton
        alignSelf='flex-start'
        position='relative'
        right={-1}
        top={-1}
        onClick={() => setCancelRequestAlert(false)}
      />
      </Alert>
      )}

      <GcdsGrid
        columns="minmax(100px, 900px) minmax(100px, 250px)"
        justifyContent="space-between"
      >
        <GcdsContainer size="lg" border>
          <GcdsText style={{ paddingTop: 20, paddingLeft: 20 }}>
            <div style={{display: "flex"}}>
              <BsLaptop style={{ paddingRight: 5 }} />
              <strong> Asset Details </strong>
            </div>
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
            <div style={{display: "flex"}}>
              <MdOutlineComment style={{ paddingRight: 5 }} />
              <strong> Comments </strong>
            </div>
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
            <div style={{display: "flex"}}>
              <GoTag style={{ paddingRight: 5 }} />
              <strong> Asset details </strong>
            </div>
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
