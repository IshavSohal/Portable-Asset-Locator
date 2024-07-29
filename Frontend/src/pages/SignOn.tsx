import {
    GcdsButton,
    GcdsContainer,
    GcdsDateModified,
    GcdsHeading,
    GcdsInput,
} from '@cdssnc/gcds-components-react'
import MainTemplate from '../templates/MainTemplate'
import { GcdsButtonCustomEvent } from '@cdssnc/gcds-components/dist/types/components'
import { useState } from 'react'
import { useAuth } from '../hooks/AuthProvider'

function SignOn() {
    const { logIn } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmission(
        e: GcdsButtonCustomEvent<void>
    ): Promise<void> {
        // TODO: capture credentials from form
        const email = 'jenny.zhang@ec.gc.ca'
        const password = 'aPassword123'

        setIsSubmitting(true)
        try {
            await logIn(email, password)
        } catch (err) {
            // setError((err as Error).message);
            alert((err as Error).message)
        } finally {
            setIsSubmitting(false)
        }
        setIsSubmitting(false)
    }

    return (
        <MainTemplate currentPage="signin">
            <GcdsHeading tag="h1" style={{ marginBottom: 48 }}>
                {' '}
                Sign-In{' '}
            </GcdsHeading>
            {/* TODO: Add Error component */}
            <GcdsInput
                inputId="input-email"
                label="Email"
                name="sign-in-email"
                required
                style={{ marginBottom: 48 }}
            ></GcdsInput>

            <GcdsInput
                inputId="input-password"
                label="Password"
                name="sign-in-email"
                type="password"
                required
                style={{ marginBottom: 48 }}
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
    )
}

export default SignOn
