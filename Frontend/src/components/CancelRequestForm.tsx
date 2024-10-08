import { useState } from 'react';
import { fetchPatch } from '../requests/requests';
import { useAuth } from '../hooks/AuthProvider';
import {
  GcdsButton,
  GcdsErrorMessage,
  GcdsText,
} from '@cdssnc/gcds-components-react';

export interface Props {
  /**
   * Name of the current page.
   */
  name: string;
  tag: string;
  requestid: number;
  onCancel?: () => void;
  onComplete: () => void;
}

function CancelRequestForm({ name, tag, requestid, onCancel, onComplete }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const { user } = useAuth();

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      if (user) {
        const res = await cancelRequest(requestid);
        console.log('cancelRequest result');
        console.log(res);
        onComplete();
      }
    } catch (err) {
      console.log(err);
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <GcdsText>
        {name} ({tag}) is currently requested by you  <br/> <br/>
        Cancelling this request would make it available for other users to request and reserve. <br/> <br/>
        Are you sure you wish to cancel?
      </GcdsText>

      {error && (
      <GcdsErrorMessage messageId="message-props">{error}</GcdsErrorMessage>
      )}

      <div style={{display: "flex", justifyContent: "flex-end"}}>
        <GcdsButton 
          buttonRole="secondary" 
          onGcdsClick={onCancel} 
          style={{paddingRight: 5}}>
            Return
        </GcdsButton>
        <GcdsButton onGcdsClick={handleSubmit}>
            Cancel Request
        </GcdsButton>
      </div>


    </>
  );
}

const cancelRequest = async (reqID: number) => {
    const partialRequest = {
        requestStatusName: 'Cancelled'
    };

    const response = await fetchPatch(`/api/request/${reqID}`, partialRequest);
  
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(
        'cancelRequest Error:' + response.status + (await response.text())
      );
    }
  }



export default CancelRequestForm;
