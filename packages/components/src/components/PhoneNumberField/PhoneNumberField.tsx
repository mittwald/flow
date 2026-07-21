import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { TextField, type TextFieldProps } from "@/components/TextField";
import {
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";
import { type FocusEvent, useRef, useState } from "react";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider";

export interface PhoneNumberFieldProps extends Omit<
  TextFieldProps,
  "type" | "showCharacterCount"
> {
  /**
   * The country used to interpret phone numbers entered without a country
   * calling code. Numbers entered with a "+" prefix are detected
   * automatically.
   *
   * @default "DE"
   */
  defaultCountry?: CountryCode;
}

export const PhoneNumberField = flowComponent("PhoneNumberField", (props) => {
  const {
    defaultCountry = "DE",
    value,
    defaultValue,
    onChange,
    onBlur,
    validate,
    children,
    ...rest
  } = props;

  const translation = useLocalizedStringFormatter(locales, "PhoneNumberField");

  const parse = (input: string) =>
    parsePhoneNumberFromString(input, defaultCountry);

  const toDisplayValue = (input: string) => {
    const phoneNumber = parse(input);
    return phoneNumber?.isValid() ? phoneNumber.formatInternational() : input;
  };

  const toNormalizedValue = (input: string) => {
    const phoneNumber = parse(input);
    return phoneNumber?.isValid() ? phoneNumber.number : input;
  };

  const [displayValue, setDisplayValue] = useState(() =>
    toDisplayValue(value ?? defaultValue ?? ""),
  );

  const emittedValue = useRef(value);

  if (value !== undefined && value !== emittedValue.current) {
    emittedValue.current = value;
    setDisplayValue(toDisplayValue(value));
  }

  const handleChange = (input: string) => {
    setDisplayValue(input);
    const normalized = toNormalizedValue(input);
    emittedValue.current = normalized;
    onChange?.(normalized);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    setDisplayValue((current) => toDisplayValue(current));
    onBlur?.(event);
  };

  const handleValidate = (input: string) => {
    if (input !== "" && !parse(input)?.isValid()) {
      return translation.format("invalid");
    }
    return validate?.(toNormalizedValue(input));
  };

  return (
    <TextField
      {...rest}
      type="tel"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      validate={handleValidate}
    >
      {children}
    </TextField>
  );
});

export default PhoneNumberField;
