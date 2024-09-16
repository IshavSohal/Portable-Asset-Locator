import { useState } from 'react';
import { fetchGet } from '../requests/requests';
import { asset, assignment, user, userAlt } from '../types/data';
import {
  GcdsButton,
  GcdsErrorMessage,
  GcdsText,
} from '@cdssnc/gcds-components-react';
import { Spinner } from '@chakra-ui/react';

export interface Props {
  user: user | null;
  asset: asset | null;
  assignment: assignment | null;
  onCancel?: () => void;
  onComplete: () => void;
}

function UnassignUserForm({
  user,
  asset,
  assignment,
  onCancel,
  onComplete,
}: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const handleSubmit = async () => {
    try {
      setError('');
      setSubmitting(true);
      if (assignment) {
        const res = await submitUnassignment(assignment.id);
        console.log(await res.text());
        onComplete();
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <GcdsText>
        <strong>{asset?.name}</strong> is currently assigned to{' '}
        <strong>
          {user?.firstName} {user?.lastName}
        </strong>
        .
      </GcdsText>
      <GcdsText>
        Unassigning this asset would make it available for other users to
        request.
      </GcdsText>
      <GcdsText>
        The end date will automatically be set to the current time.
      </GcdsText>
      {error && (
        <GcdsErrorMessage messageId="message-props">{error}</GcdsErrorMessage>
      )}
      <div
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
      >
        <GcdsButton
          disabled={submitting}
          style={{ marginRight: 12 }}
          onGcdsClick={handleSubmit}
        >
          Unassign
        </GcdsButton>
        <GcdsButton
          disabled={submitting}
          buttonRole="secondary"
          onGcdsClick={onCancel}
        >
          Cancel
        </GcdsButton>
        {submitting && (
          <Spinner thickness="3px" size="lg" style={{ marginLeft: 20 }} />
        )}
      </div>
    </>
  );
}

const submitUnassignment = async (assignmentID: number) => {
  const response = await fetchGet(`/api/assignment/end/${assignmentID}`);
  return response;
};

const mockUsers: userAlt[] = [
  {
    UID: 1,
    email: 'abcdefghi@ec.gc.ca',
    firstName: 'abc',
    lastName: 'abc',
    role: 'Base',
  },
];

export default UnassignUserForm;
