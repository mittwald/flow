/* eslint-disable unused-imports/no-unused-imports -- these imports only exist to type-assert what the entrypoints (re-)export. */
import type { PasswordCreationFieldProps as ignoredPasswordCreationFieldPropsFromIntegration } from "@/integrations/@mittwald/password-tools-js";

// @ts-expect-error PasswordCreationFieldProps is not exported from the default entry.
import type { PasswordCreationFieldProps as ignoredPasswordCreationFieldPropsFromDefault } from "@/index/default";
