import { 
    GcdsButton, 
    GcdsContainer,
    GcdsDateModified,
    GcdsHeading, 
    GcdsInput
} from '@cdssnc/gcds-components-react'
import MainTemplate from "../templates/MainTemplate";

function SignOn() {
    return (
        <MainTemplate currentPage="signin">
            <GcdsHeading tag="h1" style={{ marginBottom: 48 }}>
                Sign-In
            </GcdsHeading>
            <GcdsInput
                inputId="input-email"
                label="Email"
                name="sign-in-email"
                required
                style={{ marginBottom: 48, width: '110%'}}
            ></GcdsInput>

            <GcdsInput
                inputId="input-password"
                label="Password"
                name="sign-in-email"
                type="password"
                required
                style={{ marginBottom: 48, width: '110%'}}
            ></GcdsInput>

            <GcdsButton> Sign in </GcdsButton>

            <GcdsContainer size="xl" centered style={{ paddingBottom: 10 }}>
                <GcdsDateModified>2024-07-19</GcdsDateModified>
            </GcdsContainer>
        </MainTemplate>
    )
}

export default SignOn
