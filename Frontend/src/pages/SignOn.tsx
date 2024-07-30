import {
    GcdsButton,
    GcdsContainer,
    GcdsDateModified,
    GcdsHeading,
    GcdsInput,
} from '@cdssnc/gcds-components-react';
import MainTemplate from '../templates/MainTemplate';
import {
    GcdsButtonCustomEvent,
    GcdsInputCustomEvent,
} from '@cdssnc/gcds-components/dist/types/components';
import { useState } from 'react';
import { useAuth } from '../hooks/AuthProvider';

interface InputValues {
    email: string;
    password: string;
}

function SignOn() {
    const { logIn } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [inputFields, setInputFields] = useState<InputValues>({
        email: '',
        password: '',
    });

    async function handleSubmission(
        e: GcdsButtonCustomEvent<void>
    ): Promise<void> {
        const { email, password } = inputFields;

        setIsSubmitting(true);
        try {
            await logIn(email, password);
        } catch (err) {
            // setError((err as Error).message);
            alert((err as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleChange = (e: GcdsInputCustomEvent<any>) => {
        setInputFields({ ...inputFields, [e.target.name]: e.target.value });
    };

    return (
        <MainTemplate currentPage="signin">
            <GcdsHeading tag="h1" style={{ marginBottom: 48 }}>
                Sign-In
            </GcdsHeading>
            {/* TODO: Add Error component */}
            <GcdsInput
                inputId="input-email"
                label="Email"
                name="email"
                required
                style={{ marginBottom: 48, width: '110%' }}
                onGcdsInput={handleChange}
            ></GcdsInput>

            <GcdsInput
                inputId="input-password"
                label="Password"
                name="password"
                type="password"
                required
                style={{ marginBottom: 48, width: '110%' }}
                onGcdsInput={handleChange}
            ></GcdsInput>

            <GcdsButton
                onGcdsClick={(e: any) => handleSubmission(e)}
                disabled={isSubmitting}
            >
                Sign in
            </GcdsButton>

            <GcdsContainer size="xl" centered style={{ paddingBottom: 10 }}>
                <GcdsDateModified>2024-07-19</GcdsDateModified>
            </GcdsContainer>
        </MainTemplate>
    );
}

export default SignOn;
