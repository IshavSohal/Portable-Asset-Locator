import {
    GcdsButton,
    GcdsContainer,
    GcdsDateModified,
    GcdsHeading,
    GcdsText
} from '@cdssnc/gcds-components-react';
import MainTemplate from '../templates/MainTemplate';
import { useNavigate } from 'react-router-dom';


function NotFound() {
    const navigate = useNavigate();

    return (
        <MainTemplate>
        <GcdsHeading tag="h1" style={{ marginBottom: 48 }}>
            404 Page not found
        </GcdsHeading>

        <GcdsText style={{ marginBottom: 48 }}> 
            <div style={{textWrap: 'nowrap'}}> 
                The page you are looking for may have been removed, deleted, or possibly never existed.
            </div>
         </GcdsText>

        <GcdsButton onGcdsClick={(e: any) => navigate('/dashboard') }> 
            Return to Dashboard
        </GcdsButton>

        <GcdsContainer size="xl" centered style={{ paddingBottom: 10 }}>
            <GcdsDateModified>2024-08-20</GcdsDateModified>
        </GcdsContainer>
    </MainTemplate>
    );
}

export default NotFound;