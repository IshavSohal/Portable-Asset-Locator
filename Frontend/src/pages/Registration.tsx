import {
  GcdsButton,
  GcdsContainer,
  GcdsDateModified,
  GcdsHeading,
  GcdsInput,
} from "@cdssnc/gcds-components-react";

import type { Validator } from "@cdssnc/gcds-components/dist/types/validators";

import MainTemplate from "../templates/MainTemplate";
import { useState } from "react";
import { GcdsButtonCustomEvent } from "@cdssnc/gcds-components/dist/types/components";

interface inputValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface errorValues {
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
  // TODO: Implement these two states (get values & whatnot), may be needed for submission verification?
  const [formInputs, setFormInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  } as inputValues);
  const [formErrors, setFormErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  } as errorValues);

  /**
   * The current password string.
   */
  const [currentPass, setCurrentPass] = useState("");

  /**
   * Error checker for the name input boxes (first & last).
   * Current conditions: Name must be <= 50 characters, and contain no numbers
   * @param len Whether the length of the name should be checked.
   * @param nums Whether to check for numbers inside the name.
   * @returns A validator that returns whether the name meets the conditions; and an error object containing the relevant error messages.
   */
  function getNameValidator(len: boolean, nums: boolean): Validator<string> {
    // Create errorMessage object
    let errorMessage = { en: "", fr: "" };

    if (len && nums) {
      errorMessage["en"] =
        "Multiple errors: your name is too long; names cannot have numbers.";
      errorMessage["fr"] = `French Hon hon hon hon.`;
    } else if (len) {
      errorMessage["en"] = "Your name is over 50 characters long.";
      errorMessage["fr"] = `French Hon hon hon hon.`;
    } else if (nums) {
      errorMessage["en"] = "Names cannot have numbers.";
      errorMessage["fr"] = `French Hon hon hon hon.`;
    }

    return {
      validate: (value: string) => {
        value = value || "";
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
    let errorMessage = { en: "", fr: "" };

    errorMessage["en"] = "Must be an email, and end with @ec.gc.ca.";
    errorMessage["fr"] = "HONHONHON";

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
    const value = currentPass || "";

    const checkLen = value.length >= 8;
    const checkUpper = /[A-Z]/.test(value);
    const checkNums = /\d/.test(value);
    const checkSpecials = !/[^a-zA-Z0-9!?@#$%^&*().]/.test(value);

    let errorMessage = { en: "", fr: "" };
    errorMessage["en"] = "Your password still needs: ";
    errorMessage["fr"] = "FR";

    if (!checkLen) {
      errorMessage["en"] += "minimum 8 characters";
      errorMessage["fr"] += "FR";
    }

    if (!checkUpper) {
      if (!checkLen) {
        errorMessage["en"] += "; ";
        errorMessage["fr"] += "; ";
      }
      errorMessage["en"] += "one uppercase character";
      errorMessage["fr"] += "FR";
    }

    if (!checkNums) {
      if (!checkLen || !checkUpper) {
        errorMessage["en"] += "; ";
        errorMessage["fr"] += "; ";
      }
      errorMessage["en"] += "one number";
      errorMessage["fr"] += "FR";
    }

    if (!checkSpecials) {
      if (!checkLen || !checkUpper || !checkNums) {
        errorMessage["en"] += "; ";
        errorMessage["fr"] += "; ";
      }
      errorMessage["en"] += "no special characters except !?@#$%^&*()";
      errorMessage["fr"] += "FR";
    }

    errorMessage["en"] += ".";
    errorMessage["fr"] += ".";

    return {
      validate: (value: string) => {
        value = value || "";
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
   * Handler for "Submit" button presses. Should contain the logic for calling the registration
   * API endpoint and also error handling for when the registration is invalid.
   * @param e The button click event.
   */
  function handleSubmission(e: GcdsButtonCustomEvent<void>): void {
    // TODO: Logic for calling registration API, frontend error handling (error summary?), handling backend errors sent back (?)
    console.log("Submission function not implemented!");
  }

  return (
    <>
      <MainTemplate currentPage="register">
        <GcdsHeading tag="h1" style={{paddingBottom: 28}}>Register PAL Account</GcdsHeading>
        <GcdsInput
          inputId="input-firstname"
          error-links="FirstName"
          label="First Name"
          hint="Maximum 50 characters."
          name="registration-first-name"
          required
          validator={[
            getNameValidator(true, true),
            getNameValidator(true, false),
            getNameValidator(false, true),
          ]}
          validateOn="other"
          onGcdsInput={(e: any) => e.target.validate()}
          style={{ marginBottom: 48 }}
        />
        <GcdsInput
          inputId="input-lastname"
          label="Last Name"
          hint="Maximum 50 characters."
          name="registration-last-name"
          required
          validator={[
            getNameValidator(true, true),
            getNameValidator(true, false),
            getNameValidator(false, true),
          ]}
          validateOn="other"
          onGcdsInput={(e: any) => e.target.validate()}
          style={{ marginBottom: 48 }}
        />
        <GcdsInput
          inputId="input-email"
          label="Email"
          hint="Must end in @ec.gc.ca."
          name="registration-email"
          required
          validator={[getEmailValidator()]}
          style={{ marginBottom: 48 }}
        />
        <GcdsInput
          inputId="input-password"
          label="Password"
          hint="Must be a minimum of 8 characters, with at least one uppercase character and one number. Only these special characters are allowed: !?@#$%^&*()"
          name="registration-password"
          type="password"
          required
          validator={[getPasswordValidator()]}
          validateOn="other"
          onGcdsInput={(e: any) => {
            setCurrentPass(e.target.value || ""); // TODO: Bad async stuff, activating too late to show until next round. Find a way to use useEffect.
            setTimeout(() => e.target.validate(), 25); // Really hacky solution to deal with above async stuff. Might break, find a better way w/ useEffect or other.
          }}
          style={{ marginBottom: 48}}
        />

        <GcdsButton
          buttonId="registration-submit"
          type="submit"
          onGcdsClick={(e: any) => handleSubmission(e)}
        >
          Submit
        </GcdsButton>

        <GcdsContainer size="xl" centered style={{paddingBottom: 10}}>
              <GcdsDateModified>
                  2024-07-19
              </GcdsDateModified>
        </GcdsContainer>
      </MainTemplate>
    </>
  );
}

export default Registration;
