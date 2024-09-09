import { useEffect, useState } from 'react';
import { fetchGet, fetchPost } from '../requests/requests';
import { user } from '../types/data';
import {
  GcdsButton,
  GcdsErrorMessage,
  GcdsSelect,
  GcdsText,
} from '@cdssnc/gcds-components-react';

export interface Props {
  /**
   * Name of the current page.
   */
  name: string;
  tag: string;
  id: number;
  onCancel?: () => {};
  onComplete: () => void;
}

function AssignUserForm({ name, tag, id, onCancel, onComplete }: Props) {
  const now = new Date();
  const [users, setUsers] = useState<user[]>([]);
  const [selectedUser, setSelectedUser] = useState<null | number>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dataFetch = async () => {
      try {
        const usersList = await getListOfUsers();
        console.log(usersList);
        setUsers(usersList);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    dataFetch();
  }, []);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      if (selectedUser) {
        const res = await submitAssignment(id, selectedUser);
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
        <ul style={{ listStyle: 'none' }}>
          <li>Asset: {name}</li>
          <li>Asset tag: {tag}</li>
          <li>Assignment will start on: {now.toDateString()}</li>
        </ul>
      </GcdsText>
      {!loading && (
        <GcdsSelect
          selectId="select-props"
          label="Assign to"
          name="select-assignee"
          hint="Select user email"
          defaultValue="Select option."
          onGcdsChange={(e) =>
            e.target.value ? setSelectedUser(parseInt(e.target.value)) : null
          }
          //disabled={loading}
        >
          {users.map((user) => (
            <option value={user.UID} key={`option-${user.UID}`}>
              {user.email}
            </option>
          ))}
        </GcdsSelect>
      )}
      {/* <FormControl w="60">
        <FormLabel>User (email)</FormLabel>
        <AutoComplete openOnFocus>
          <AutoCompleteInput
            variant="outline"
            placeholder="Select or type to filter..."
          />
          <AutoCompleteList>
            {users.map((user) => (
              <AutoCompleteItem
                key={`option-${user.id}`}
                value={user.email}
                textTransform="lowercase"
              >
                {user.email}
              </AutoCompleteItem>
            ))}
          </AutoCompleteList>
        </AutoComplete>
        <FormHelperText>Select or type to filter users...</FormHelperText>
      </FormControl> */}
      {error && (
        <GcdsErrorMessage messageId="message-props">{error}</GcdsErrorMessage>
      )}
      <GcdsButton style={{ marginRight: 12 }} onGcdsClick={handleSubmit}>
        Assign
      </GcdsButton>
      <GcdsButton buttonRole="secondary" onGcdsClick={onCancel}>
        Cancel
      </GcdsButton>
    </>
  );
}

const getListOfUsers = async () => {
  const users = (await (await fetchGet('/api/users')).json()) as user[];
  return users;
};

const submitAssignment = async (assetId: number, assigneeId: number) => {
  const assignment = {
    asset: assetId,
    assignee: assigneeId,
  };
  const response = await fetchPost('/api/assignment', assignment);
  return response;
};

const mockUsers: user[] = [
  {
    UID: 1,
    email: 'abcdefghi@ec.gc.ca',
    firstName: 'abc',
    lastName: 'abc',
    role: 'Base',
  },
];

export default AssignUserForm;
