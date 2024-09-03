import { useEffect, useState } from 'react';
import { fetchGet } from '../requests/requests';
import { user } from '../types/user';
import { GcdsSelect, GcdsText } from '@cdssnc/gcds-components-react';

export interface Props {
  /**
   * Name of the current page.
   */
  name: string;
  tag: string;
}

function AssignUserForm({ name, tag }: Props) {
  const now = new Date();
  const [users, setUsers] = useState<user[]>([]);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dataFetch = async () => {
      try {
        setUsers(await getListOfUsers());
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
      {/* <GcdsText>Asset tag: {tag}</GcdsText>
      <GcdsText>Assignment will start on: {now.toDateString()}</GcdsText> */}
      <GcdsSelect
        selectId="select-props"
        label="Assign to"
        name="select-assignee"
        hint="Select user email"
        defaultValue="Select option."
      >
        {users.map((user) => (
          <option value={user.email} key={`option-${user.id}`}>
            {user.email}
          </option>
        ))}
      </GcdsSelect>
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
    </>
  );
}

const getListOfUsers = async () => {
  // const users = (await (await fetchGet('/api/users')).json()) as user[];
  const users = mockUsers;
  return users;
};

const mockUsers: user[] = [
  {
    id: 1,
    email: 'abcdefghi@ec.gc.ca',
    firstName: 'abc',
    lastName: 'abc',
    role: 'Base',
  },
];

export default AssignUserForm;
