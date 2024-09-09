import { useEffect, useState } from 'react';
import { fetchGet, fetchPost } from '../requests/requests';
import { user } from '../types/data';
import {
  GcdsButton,
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
}

function AssignUserForm({ name, tag, id, onCancel }: Props) {
  const now = new Date();
  const [users, setUsers] = useState<user[]>([]);
  const [selectedUser, setSelectedUser] = useState<null | string>(null);
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
          onGcdsChange={(e) => setSelectedUser(e.target.value || null)}
          //disabled={loading}
        >
          {users.map((user) => (
            <option value={user.email} key={`option-${user.UID}`}>
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
      <GcdsButton style={{ marginRight: 12 }}>Assign</GcdsButton>
      <GcdsButton buttonRole="secondary" onClick={onCancel}>
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
