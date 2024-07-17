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

interface inputValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string; // TODO: Security?
}

interface errorValues {
  firstName: string;
  lastName: string;
  password: string; // Form has built-in email validation
}

function Registration() {
  const [formInputs, setFormInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  } as inputValues);
  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    password: "",
  } as errorValues);

  const [currentPass, setCurrentPass] = useState("");
  
  // Error checker for the name input boxes.
  function getNameValidator(len: boolean, nums: boolean): Validator<string> {
    // Create errorMessage object
    let errorMessage = { en: "", fr: "" };
    if (len && nums) {
      errorMessage["en"] =
        "Multiple errors: your name is too long; names cannot have numbers.";
      errorMessage["fr"] = `French Hon hon hon hon.`;
    } else if (len) {
      errorMessage["en"] = "Your name is too long. Shorten it.";
      errorMessage["fr"] = `French Hon hon hon hon.`;
    } else if (nums) {
      errorMessage["en"] = "Names cannot have numbers. Remove them.";
      errorMessage["fr"] = `French Hon hon hon hon.`;
    }

    // const tempErr = formErrors;
    // formErrors.firstName = errorMessage.en;
    // setFormErrors(tempErr);
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

  // Error checker for the password input box.
  // Must be a minimum of 8 characters, with at least one uppercase character
  // and one number. Only these special characters are allowed: !?@#$%^&*()
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

    // const tempErr = formErrors;
    // formErrors.firstName = errorMessage.en;
    // setFormErrors(tempErr);
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

  return (
    <>
      <MainTemplate currentPage="register">
        <GcdsHeading tag="h1">Register PAL Account</GcdsHeading>

        <GcdsContainer size="full" style={{ paddingTop: "48px" }}>
          <GcdsInput
            inputId="input-default"
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
            onGcdsInput={(e) => e.target.validate()}
            value={formInputs.firstName}
            style={{ marginBottom: "48px" }}
          />
          <GcdsInput
            inputId="input-default"
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
            onGcdsInput={(e) => e.target.validate()}
            style={{ marginBottom: "48px" }}
          />
          <GcdsInput
            inputId="input-default"
            label="Email"
            hint="Must end in @ec.gc.ca."
            name="registration-email"
            type="email"
            required
            style={{ marginBottom: "48px" }}
          />
          <GcdsInput
            inputId="input-default"
            label="Password"
            hint="Must be a minimum of 8 characters, with at least one uppercase character and one number. Only these special characters are allowed: !?@#$%^&*()"
            name="registration-password"
            type="password"
            required
            validator={[getPasswordValidator()]}
            validateOn="other"
            onGcdsInput={(e) => {
              setCurrentPass(e.target.value || ""); // TODO: Bad async stuff, activating too late to show until next round. Find a way to use useEffect.
              setTimeout(() => e.target.validate(), 25); // Really hacky solution to deal with above async stuff. Might break, find a better way w/ useEffect or other.
            }}
            style={{ marginBottom: "48px" }}
          />

          <GcdsButton buttonId="registration-submit">Submit</GcdsButton>
        </GcdsContainer>

        <GcdsDateModified>2024-07-17</GcdsDateModified>
      </MainTemplate>
    </>
  );
}

export default Registration;
