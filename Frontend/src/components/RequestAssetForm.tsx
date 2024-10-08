import { useState } from 'react';
import { fetchPost } from '../requests/requests';
import { useAuth } from '../hooks/AuthProvider';
import {
  GcdsButton,
  GcdsErrorMessage,
  GcdsInput,
  GcdsSelect,
  GcdsText,
} from '@cdssnc/gcds-components-react';

import {
  GcdsSelectCustomEvent,
  GcdsInputCustomEvent,
} from '@cdssnc/gcds-components/dist/types/components';
export interface Props {
  /**
   * Name of the current page.
   */
  name: string;
  tag: string;
  id: number;
  onCancel?: () => void;
  onComplete: () => void;
}

function RequestAssetForm({ name, tag, id, onCancel, onComplete }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [notes, setNotes] = useState<null | string>(null);
  const [year, setYear] = useState('');
  const [yearError, setYearError] = useState(true);
  const [month, setMonth] = useState('');
  const [monthError, setMonthError] = useState(true);
  const [day, setDay] = useState('');
  const [dayError, setDayError] = useState(true);
  const { user } = useAuth();

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      if (user) {
        console.log(user);
        const date = new Date(`${year}-${month}-${day}`).toISOString();
        console.log(date);
        const res = await submitRequest(id, user.id, date, notes);
        console.log(await res.text());
        onComplete();
      }
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: GcdsInputCustomEvent<any> | GcdsSelectCustomEvent<any>) => {
    if(e.target.name === 'month'){
      setMonth(e.target.value!);
      setMonthError(false);
    }
    else if (e.target.name === 'day'){
      setDay(e.target.value ?? '')
      setDayError(false);
      if (!(/^\d+$/.test(e.target.value!))){
        setDayError(true);
      } 

    }
    else if (e.target.name === 'year'){
      setYear(e.target.value ?? '')
      setYearError(false);
      if (!(/^\d+$/.test(e.target.value!))){
        setYearError(true);
      } 
    }

    else if (e.target.name === 'notes'){
      setNotes(e.target.value ?? null)
    }

    if(year !== '' && day !== '' && month !== ''){
      try {
        const date = new Date(`${year}-${month}-${day}`).toISOString();
        console.log(date);
      } catch (err){
        console.error(err);
      }
    }
  };

  return (
    <>
      <GcdsText>
        <ul style={{ listStyle: 'none' }}>
            <li>Asset: {name}</li>
            <li>Asset tag: {tag}</li>
        </ul>
      </GcdsText>

      <div style={{display: 'flex', alignItems: "flex-end"}}>
        <GcdsText style={{paddingRight: 40, alignSelf: 'flex-start'}}> Start Date: </GcdsText>
        <div style={{display: "flex", flexDirection: 'column', justifyContent: 'flex-start'}}>
          <div style={{fontSize: 20}}> Month </div>
          <GcdsSelect
            selectId="select-props"
            label=""
            name="month"
            hint=""
            defaultValue="Select option."
            style={{paddingRight: 10}}
            onGcdsChange={handleChange}
          >
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </GcdsSelect>
        </div>

        <div style={{display: "flex", flexDirection: 'column', justifyContent: 'flex-start'}}>
          <div style={{fontSize: 20}}> Day </div>
          <GcdsInput
            inputId="input-default"
            label=""
            name="day"
            size={2}
            style={{paddingRight: 10}}
            onGcdsInput={handleChange}
          >
          </GcdsInput>
        </div>

        <div style={{display: "flex", flexDirection: 'column', justifyContent: 'flex-start'}}>
           <div style={{fontSize: 20}}> Year </div>
          <GcdsInput
            inputId="input-default"
            label=""
            name="year"
            size={4}
            style={{}}
            onGcdsInput={handleChange}
          >
          </GcdsInput>
        </div>


      </div>

      <GcdsInput
          inputId="input-default"
          label="Notes"
          name="notes"
          onGcdsInput={handleChange}
        >
        </GcdsInput>

      {error && (
      <GcdsErrorMessage messageId="message-props">{error}</GcdsErrorMessage>
      )}

      <div style={{display: "flex", justifyContent: "flex-end"}}>
        <GcdsButton 
          buttonRole="secondary" 
          onGcdsClick={onCancel} 
          style={{paddingRight: 5}}>
            Cancel
        </GcdsButton>
        <GcdsButton onGcdsClick={handleSubmit} disabled={yearError || monthError || dayError}>
            Request
        </GcdsButton>
      </div>


    </>
  );
}

const submitRequest = async (assetId: number, assigneeId: number, date: string, note?: string | null) => {
  const request = {
    assignee: assigneeId,
    asset: assetId,
    startDate: date, 
    notes: note
  }
  const response = await fetchPost('/api/request', request);
  return response;
}


export default RequestAssetForm;
