import { testEnvironments } from "@/tests/lib/environments";
import * as LocalReactHookForm from "@mittwald/flow-react-components/react-hook-form";
import {
  type PolicyGenericDeclaration,
  RuleType,
  usePasswordCreationFieldValidation,
} from "@mittwald/flow-react-components/mittwald-password-tools-js";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { expect, test } from "vitest";
import { userEvent } from "vitest/browser";

type TestEnvironment = (typeof testEnvironments)[number];

// Harnesses that swap the environments (cross-version, Vue parity) cannot
// render a react-hook-form form. The remote integration is loaded per test, so
// those harnesses never import it.
const runsInHarness = testEnvironments.some(
  (environment) => !["Local", "Remote"].includes(String(environment)),
);

const reactHookFormOf = async (environment: TestEnvironment) =>
  String(environment) === "Local"
    ? LocalReactHookForm
    : await import("@/integrations/react-hook-form");

const validationPolicy: PolicyGenericDeclaration = {
  minComplexity: 1,
  rules: [{ ruleType: RuleType.length, min: 8 }],
};
const policyError = "Please choose a password with at least 8 characters.";
const genericError = "Please check your input";

test.skipIf(runsInHarness).each(testEnvironments)(
  "PasswordCreationField policy error without form validation (%s)",
  async (environment) => {
    const {
      testScreenshot,
      render,
      container,
      components: { Label, PasswordCreationField },
    } = environment;
    const { Field, Form } = await reactHookFormOf(environment);
    const TestForm = () => {
      const form = useForm<{ password: string }>({ mode: "onChange" });

      return (
        <Form form={form} onSubmit={() => undefined}>
          <Field name="password">
            <PasswordCreationField validationPolicy={validationPolicy}>
              <Label>Password without form validation</Label>
            </PasswordCreationField>
          </Field>
        </Form>
      );
    };

    await render(<TestForm />);
    const input = container.getByLabelText("Password without form validation");
    await userEvent.type(input, "abc");

    await expect
      .element(input)
      .toHaveAccessibleDescription(expect.stringContaining(policyError));
    await expect
      .element(input)
      .toHaveAccessibleDescription(expect.not.stringContaining(genericError));
    await testScreenshot(
      "PasswordCreationField policy error without form validation",
    );
  },
);

test.skipIf(runsInHarness).each(testEnvironments)(
  "PasswordCreationField policy error with form validation (%s)",
  async (environment) => {
    const {
      testScreenshot,
      render,
      container,
      components: { Label, PasswordCreationField },
    } = environment;
    const { Field, Form } = await reactHookFormOf(environment);
    const TestForm = () => {
      const form = useForm<{ password: string }>({ mode: "onChange" });
      const validate = usePasswordCreationFieldValidation(validationPolicy);

      return (
        <Form form={form} onSubmit={() => undefined}>
          <Field name="password" rules={{ validate }}>
            <PasswordCreationField validationPolicy={validationPolicy}>
              <Label>Password with form validation</Label>
            </PasswordCreationField>
          </Field>
        </Form>
      );
    };

    await render(<TestForm />);
    const input = container.getByLabelText("Password with form validation");
    await userEvent.type(input, "abc");

    await expect.element(input).toHaveAttribute("aria-invalid", "true");
    await expect
      .element(input)
      .toHaveAccessibleDescription(expect.stringContaining(policyError));
    await expect
      .element(input)
      .toHaveAccessibleDescription(expect.not.stringContaining(genericError));
    await testScreenshot(
      "PasswordCreationField policy error with form validation",
    );
  },
);

test.skipIf(runsInHarness).each(testEnvironments)(
  "PasswordCreationField fallback form error with a valid password (%s)",
  async (environment) => {
    const {
      testScreenshot,
      render,
      container,
      components: { Label, PasswordCreationField },
    } = environment;
    const { Field, Form } = await reactHookFormOf(environment);
    const TestForm = () => {
      const form = useForm<{ password: string }>({
        defaultValues: { password: "Imperial-March-1977!" },
      });
      const { setError } = form;

      useEffect(() => {
        setError("password", { type: "server" });
      }, [setError]);

      return (
        <Form form={form} onSubmit={() => undefined}>
          <Field name="password">
            <PasswordCreationField validationPolicy={validationPolicy}>
              <Label>Password with fallback form error</Label>
            </PasswordCreationField>
          </Field>
        </Form>
      );
    };

    await render(<TestForm />);
    const input = container.getByLabelText("Password with fallback form error");
    await expect
      .poll(
        () =>
          container
            .element()
            .querySelector("[data-complexity-percentage]")
            ?.getAttribute("data-complexity-percentage"),
        { timeout: 10_000 },
      )
      .toBe("100");

    await expect
      .element(input)
      .toHaveAccessibleDescription(expect.stringContaining(genericError));
    await testScreenshot(
      "PasswordCreationField fallback form error with a valid password",
    );
  },
);
