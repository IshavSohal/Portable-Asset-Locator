import {
    GcdsButton,
    GcdsContainer,
    GcdsDateModified,
    GcdsErrorMessage,
    GcdsHeading,
    GcdsInput
} from '@cdssnc/gcds-components-react';
import MainTemplate from '../templates/MainTemplate';
import {
    GcdsButtonCustomEvent,
    GcdsInputCustomEvent,
} from '@cdssnc/gcds-components/dist/types/components';
import { useEffect,  useState, useRef } from 'react';
import { useAuth } from '../hooks/AuthProvider';
import { useNavigate } from 'react-router-dom';

interface InputValues {
    email: string;
    password: string;
}

function SignOn() {
    const { logIn } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [inputFields, setInputFields] = useState<InputValues>({
        email: '',
        password: '',
    });
    const [error, setError] = useState(false);
    const documentRef = useRef(document);

    useEffect(() => {
        const curr = documentRef.current;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter"){
                handleSubmission();
            }
        }

        curr.addEventListener("keydown", handleKeyDown);
        return () => {
            curr.removeEventListener("keydown", handleKeyDown);
        };
      
      }, [inputFields]);

    async function handleSubmission(
        e?: GcdsButtonCustomEvent<void>
    ): Promise<void> {
        const { email, password } = inputFields;
        setIsSubmitting(true);
        try {
            await logIn(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(true);
            // setError((err as Error).message);
            // alert((err as Error).message);
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
            {(error && !isSubmitting) && (
                <>
                    <GcdsErrorMessage messageId="message-props">
                        Invalid email or password. Please try again.
                    </GcdsErrorMessage>
                </>
            )}
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
                <GcdsDateModified>2024-08-20</GcdsDateModified>
            </GcdsContainer>
        </MainTemplate>
    );
}

export default SignOn;
