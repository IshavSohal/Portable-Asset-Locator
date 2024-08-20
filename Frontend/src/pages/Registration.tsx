import {
  GcdsButton,
  GcdsContainer,
  GcdsDateModified,
  GcdsErrorSummary,
  GcdsHeading,
  GcdsInput,
} from '@cdssnc/gcds-components-react';

import type { Validator } from '@cdssnc/gcds-components/dist/types/validators';

import MainTemplate from '../templates/MainTemplate';
import { useState } from 'react';
import {
  GcdsButtonCustomEvent,
  GcdsInputCustomEvent,
} from '@cdssnc/gcds-components/dist/types/components';

import { registerUser } from '../requests/auth';
import { ChakraProvider, Spinner } from '@chakra-ui/react';
import { useAuth } from '../hooks/AuthProvider';
import { useNavigate } from 'react-router-dom';

interface InputValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface ErrorValues {
  firstName: boolean;
  lastName: boolean;
  email: boolean;
  password: boolean;
}

/**
 * The registration page.
 * @returns the registration page object.
 */
function Registration() {
  const { logIn } = useAuth();
  const navigate = useNavigate();

  /**
   * Object indicating the value currently inputted in each of the form fields.
   */
  const [formInputs, setFormInputs] = useState<InputValues>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  function updateFormInputs(e: GcdsInputCustomEvent<any>) {
    setFormInputs({ ...formInputs, [e.target.name]: e.target.value });
  }

  /**
   * Object indicating whether each of the form inputs has an error.
   */
  const [formErrors, setFormErrors] = useState<ErrorValues>({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  });
  const updateErrors = (e: GcdsInputCustomEvent<any>, errorState: boolean) => {
    setFormErrors({ ...formErrors, [e.target.name]: errorState });
  };

  /**
   * Whether the page is currently contacting the registration endpoint (blocking).
   */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Whether the error summary should be shown.
   */
  const [showErrorSummary, setShowErrorSummary] = useState(false);
  /**
   * The current error string object to show in the error summary.
   * Should only be updated on the submit event, to prevent updating the error summary
   * on every single keypress (bad UX).
   * The up-to-date individual error values (updated on every keypress) are in formErrors.
   */
  const [currentErrorSet, setCurrentErrorSet] = useState<Object>({});

  /**
   * Error checker for the name input boxes (first & last).
   * Current conditions: Name must be <= 50 characters, and contain no numbers
   * @param len Whether the length of the name should be checked.
   * @param nums Whether to check for numbers inside the name.
   * @returns A validator that returns whether the name meets the conditions; and an error object containing the relevant error messages.
   */
  function getNameValidator(len: boolean, nums: boolean): Validator<string> {
    // Create errorMessage object
    let errorMessage = { en: '', fr: '' };

    if (len && nums) {
      errorMessage['en'] =
        'Multiple errors: your name is too long; names cannot have numbers.';
      errorMessage['fr'] = `French Hon hon hon hon.`;
    } else if (len) {
      errorMessage['en'] = 'Your name is over 50 characters long.';
      errorMessage['fr'] = `French Hon hon hon hon.`;
    } else if (nums) {
      errorMessage['en'] = 'Names cannot have numbers.';
      errorMessage['fr'] = `French Hon hon hon hon.`;
    }

    return {
      validate: (value: string) => {
        value = value || '';
        // NOTE: true == pass & no error!
        if (len && nums) {
          return value.length <= 50 || !/\d/.test(value);
        } else if (len) {
          return value.length <= 50;
        } else if (nums) {
          return !/\d/.test(value);
        }
        return true;
      },
      errorMessage,
    };
  }

  /**
   * Validator for email field.
   * Current conditions: Email must be in a valid format, and end in @ec.gc.ca.
   * @returns A validator that returns whether the email meets the conditions; and an error object containing the relevant error message.
   */
  function getEmailValidator(): Validator<string> {
    let errorMessage = { en: '', fr: '' };

    errorMessage['en'] = 'Must be an email, and end with @ec.gc.ca.';
    errorMessage['fr'] = 'HONHONHON';

    return {
      validate: (value: string) => {
        // Regex: whether string ends with ec.gc.ca, and meets the formatting of an email address.
        // TODO: Make sure it's correct.
        return /\b[A-Za-z0-9._%+-]+@ec\.gc\.ca\b/.test(value);
      },
      errorMessage,
    };
  }

  /**
   * Error checker for the password input box.
   * Current conditions: Password must be a minimum of 8 characters, with at least one uppercase character
   * and one number. Only these special characters are allowed: !?@#$%^&*()
   * @returns A validator that returns whether the password meets all conditions; an error object containing a list of conditions not met yet.
   */
  function getPasswordValidator(): Validator<string> {
    // Create errorMessage object
    const value = formInputs.password || '';

    const checkLen = value.length >= 8;
    const checkUpper = /[A-Z]/.test(value);
    const checkNums = /\d/.test(value);
    const checkSpecials = !/[^a-zA-Z0-9!?@#$%^&*().]/.test(value);

    let errorMessage = { en: '', fr: '' };
    errorMessage['en'] = 'Your password still needs: ';
    errorMessage['fr'] = 'FR';

    if (!checkLen) {
      errorMessage['en'] += 'minimum 8 characters';
      errorMessage['fr'] += 'FR';
    }

    if (!checkUpper) {
      if (!checkLen) {
        errorMessage['en'] += '; ';
        errorMessage['fr'] += '; ';
      }
      errorMessage['en'] += 'one uppercase character';
      errorMessage['fr'] += 'FR';
    }

    if (!checkNums) {
      if (!checkLen || !checkUpper) {
        errorMessage['en'] += '; ';
        errorMessage['fr'] += '; ';
      }
      errorMessage['en'] += 'one number';
      errorMessage['fr'] += 'FR';
    }

    if (!checkSpecials) {
      if (!checkLen || !checkUpper || !checkNums) {
        errorMessage['en'] += '; ';
        errorMessage['fr'] += '; ';
      }
      errorMessage['en'] += 'no special characters except !?@#$%^&*()';
      errorMessage['fr'] += 'FR';
    }

    errorMessage['en'] += '.';
    errorMessage['fr'] += '.';

    return {
      validate: (value: string) => {
        value = value || '';
        // NOTE: true == pass & no error!
        const checkLen = value.length >= 8;
        const checkUpper = /[A-Z]/.test(value);
        const checkNums = /\d/.test(value);
        const checkSpecials = !/[^a-zA-Z0-9!?@#$%^&*().]/.test(value);

        return checkLen && checkUpper && checkNums && checkSpecials;
      },
      errorMessage,
    };
  }

  /**
   * Generates the objectified link+error set to display on the error area.
   * @returns An object, containing the error messages and the page links to the error-causing inputs. Can be passed directly to the ErrorSummary component.
   */
  function generateErrorSummary(): Object {
    let res: any = {};

    // First name errors

    if (formErrors.firstName) {
      res['#firstName'] = 'Error with first name.';
    }
    if (!formInputs.firstName || formInputs.firstName === '') {
      res['#firstName'] = 'First name is blank.';
    }

    // Last name errors

    if (formErrors.lastName) {
      res['#lastName'] = 'Error with last name.';
    }
    if (!formInputs.lastName || formInputs.lastName === '') {
      res['#lastName'] = 'Last name is blank.';
    }

    // Email errors

    if (formErrors.email) {
      res['#email'] = 'Error with email.';
    }
    if (!formInputs.email || formInputs.email === '') {
      res['#email'] = 'Email is blank.';
    }
    // Password errors

    if (formErrors.password) {
      res['#password'] = 'Error with password.';
    }
    if (!formInputs.password || formInputs.password === '') {
      res['#password'] = 'Password is blank.';
    }

    return res;
  }

  /**
   * Handler for "Submit" button presses. Should contain the logic for calling the registration
   * API endpoint and also error handling for when the registration is invalid.
   * @param e The button click event.
   */
  async function handleSubmission(
    e: GcdsButtonCustomEvent<void>
  ): Promise<void> {
    // Checking for errors. If there are any, show error summary and quit before contacting endpoint.
    if (
      Object.values(formErrors).find((val) => val === true) ||
      Object.values(formInputs).includes('')
    ) {
      setCurrentErrorSet(generateErrorSummary());
      setShowErrorSummary(true);
      return;
    }
    setShowErrorSummary(false);

    // Assumes that formInputs has been populated.

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const message = await registerUser(formInputs);
      alert('User created. Click "OK" to redirect to dashboard.');

      // If registration successful, login with new credentials and redirect to dashboard
      await logIn(formInputs.email, formInputs.password);
      navigate('/dashboard');
    } catch (err) {
      // Email already registered error
      if ((err as Error).message === 'Conflict') {
        setCurrentErrorSet({
          '#email': 'Error in registration: email already registered!',
        });
        // Generic catch-all message for other errors
      } else {
        setCurrentErrorSet({
          '': `Error in registration: ${(err as Error).message}`,
        });
      }
      setShowErrorSummary(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <MainTemplate currentPage="register">
        <GcdsHeading tag="h1" style={{ marginBottom: 48 }}>
          Register PAL Account
        </GcdsHeading>
        <GcdsInput
          id="firstName"
          inputId="firstName"
          name="firstName"
          error-links="legend-firstName"
          label="First Name"
          hint="Maximum 50 characters."
          required
          validator={[
            getNameValidator(true, true),
            getNameValidator(true, false),
            getNameValidator(false, true),
          ]}
          validateOn="other"
          onGcdsInput={(e: any) => {
            e.target.validate();
            updateFormInputs(e);
          }}
          onGcdsError={(e: any) => updateErrors(e, true)}
          onGcdsValid={(e: any) => updateErrors(e, false)}
          onKeyUp={(e: any) => {
            if (e.key === 'Enter') {
              handleSubmission(e);
            }
          }}
          style={{ marginBottom: '48px', width: '110%' }}
        />
        <GcdsInput
          inputId="lastName"
          name="lastName"
          label="Last Name"
          hint="Maximum 50 characters."
          required
          validator={[
            getNameValidator(true, true),
            getNameValidator(true, false),
            getNameValidator(false, true),
          ]}
          validateOn="other"
          onGcdsInput={(e: any) => {
            e.target.validate();
            updateFormInputs(e);
          }}
          onKeyUp={(e: any) => {
            if (e.key === 'Enter') {
              handleSubmission(e);
            }
          }}
          onGcdsError={(e: any) => updateErrors(e, true)}
          onGcdsValid={(e: any) => updateErrors(e, false)}
          style={{ marginBottom: '48px', width: '110%' }}
        />
        <GcdsInput
          inputId="email"
          name="email"
          label="Email"
          hint="Must end in @ec.gc.ca."
          required
          validator={[getEmailValidator()]}
          onGcdsInput={(e: any) => {
            updateFormInputs(e);
          }}
          onGcdsError={(e: any) => updateErrors(e, true)}
          onGcdsValid={(e: any) => updateErrors(e, false)}
          onKeyUp={(e: any) => {
            if (e.key === 'Enter') {
              handleSubmission(e);
            }
          }}
          style={{ marginBottom: 48, width: '110%' }}
        />
        <GcdsInput
          inputId="password"
          name="password"
          label="Password"
          hint="Must be a minimum of 8 characters, with at least one uppercase character and one number. Only these special characters are allowed: !?@#$%^&*()"
          type="password"
          required
          validator={[getPasswordValidator()]}
          validateOn="other"
          onGcdsInput={(e: any) => {
            updateFormInputs(e);
            // TODO: Bad async stuff, activating too late to show until next round. Find a way to use useEffect.
            setTimeout(() => e.target.validate(), 25); // Really hacky solution to deal with above async stuff. Might break, find a better way w/ useEffect or other.
          }}
          onGcdsError={(e: any) => updateErrors(e, true)}
          onGcdsValid={(e: any) => updateErrors(e, false)}
          onKeyUp={(e: any) => {
            if (e.key === 'Enter') {
              handleSubmission(e);
            }
          }}
          style={{ marginBottom: '48px', width: '110%' }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 20,
            alignItems: 'center',
          }}
        >
          <GcdsButton
            buttonId="registration-submit"
            type="button"
            disabled={isLoading}
            onGcdsClick={(e: any) => handleSubmission(e)}
          >
            Submit
          </GcdsButton>
          {isLoading && (
            <ChakraProvider>
              <Spinner
                thickness="2px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.800"
                size="lg"
              />
            </ChakraProvider>
          )}
        </div>

        {showErrorSummary && (
          <GcdsErrorSummary
            style={{ marginTop: 10 }}
            errorLinks={currentErrorSet}
          />
        )}

        <GcdsContainer size="xl" centered style={{ paddingBottom: 10 }}>
          <GcdsDateModified>2024-08-20</GcdsDateModified>
        </GcdsContainer>
      </MainTemplate>
    </>
  );
}

export default Registration;
