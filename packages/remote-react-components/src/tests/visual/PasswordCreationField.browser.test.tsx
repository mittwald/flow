import * as RemoteReactHookForm from "@/integrations/react-hook-form";
import {
  renderLocal,
  renderRemote,
  testEnvironments,
} from "@/tests/lib/environments";
import * as LocalReactHookForm from "@mittwald/flow-react-components/react-hook-form";
import {
  type PolicyGenericDeclaration,
  RuleType,
  usePasswordCreationFieldValidation,
} from "@mittwald/flow-react-components/mittwald-password-tools-js";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";

const reactHookFormTestEnvironments = [
  {
    ...testEnvironments[0],
    render: renderLocal,
    components: {
      ...testEnvironments[0].components,
      ...LocalReactHookForm,
    },
  },
  {
    ...testEnvironments[1],
    render: renderRemote,
    components: {
      ...testEnvironments[1].components,
      ...RemoteReactHookForm,
    },
  },
] as const;

const validationPolicy: PolicyGenericDeclaration = {
  minComplexity: 1,
  rules: [{ ruleType: RuleType.length, min: 8 }],
};
const policyError = "Please choose a password with at least 8 characters.";
const genericError = "Please check your input";

test.each(reactHookFormTestEnvironments)(
  "PasswordCreationField policy error without form validation (%s)",
  async ({
    testScreenshot,
    render,
    container,
    components: { Field, Form, Label, PasswordCreationField },
  }) => {
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

test.each(reactHookFormTestEnvironments)(
  "PasswordCreationField policy error with form validation (%s)",
  async ({
    testScreenshot,
    render,
    container,
    components: { Field, Form, Label, PasswordCreationField },
  }) => {
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

test.each(reactHookFormTestEnvironments)(
  "PasswordCreationField fallback form error with a valid password (%s)",
  async ({
    testScreenshot,
    render,
    container,
    components: { Field, Form, Label, PasswordCreationField },
  }) => {
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

test.each(testEnvironments)(
  "PasswordCreationField states (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      Flex,
      PasswordCreationField,
      Label,
      FieldError,
      IconStar,
      Button,
    },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <PasswordCreationField isRequired>
          <Label>Default</Label>
          <Button>
            <IconStar />
          </Button>
        </PasswordCreationField>
        <PasswordCreationField isInvalid>
          <Label>Invalid</Label>
          <FieldError>FieldError</FieldError>
        </PasswordCreationField>
        <PasswordCreationField isReadOnly>
          <Label>Readonly</Label>
        </PasswordCreationField>
        <PasswordCreationField isDisabled>
          <Label>Disabled</Label>
        </PasswordCreationField>
      </Flex>,
    );

    await testScreenshot("PasswordCreationField states");
  },
);

test.each(testEnvironments)(
  "PasswordCreationField interaction (%s)",
  async ({
    testScreenshot,
    render,
    components: { PasswordCreationField, Label },
  }) => {
    await render(
      <PasswordCreationField>
        <Label>Label</Label>
      </PasswordCreationField>,
    );

    const input = page.getByLocator("input");

    await testScreenshot("PasswordCreationField interaction - default");

    await userEvent.type(input, "asdf");

    await testScreenshot(
      "PasswordCreationField interaction - password entered",
    );

    const showPassword = page.getByLocator('[aria-label="Show password"]');
    await showPassword.click();

    await testScreenshot(
      "PasswordCreationField interaction - show password clicked",
    );

    const generate = page.getByText("Generate");
    await generate.click();
    const hidePassword = page.getByLocator('[aria-label="Hide password"]');
    await hidePassword.click();

    await testScreenshot(
      "PasswordCreationField interaction - password generated",
    );

    const showInfo = page.getByLocator(
      '[aria-label="More information about your password requirements"]',
    );
    await showInfo.click();

    await testScreenshot(
      "PasswordCreationField interaction - show info clicked",
    );
  },
);

/*
 * An error from outside the policy (a server error) turns the bar danger like
 * the field, even for a password the policy rates strong.
 */
test.each(testEnvironments)(
  "PasswordCreationField invalid strong password (%s)",
  async ({
    testScreenshot,
    render,
    components: { PasswordCreationField, Label, FieldError },
  }) => {
    await render(
      <PasswordCreationField isInvalid defaultValue="Imperial-March-1977!">
        <Label>Password</Label>
        <FieldError>This password was already used</FieldError>
      </PasswordCreationField>,
    );

    // The policy rates the password asynchronously (about a second); until
    // then the bar shows a provisional width. Capture the final rating, not
    // the race.
    await expect
      .poll(
        () =>
          document
            .querySelector("[data-complexity-percentage]")
            ?.getAttribute("data-complexity-percentage"),
        { timeout: 10_000 },
      )
      .toBe("100");

    await testScreenshot("PasswordCreationField invalid strong password");
  },
);

test.each(testEnvironments)(
  "PasswordCreationField edge cases (%s)",
  async ({
    testScreenshot,
    render,
    components: { PasswordCreationField, Label, ColumnLayout },
  }) => {
    await render(
      <ColumnLayout l={[1, 1, 1, 1, 1]}>
        <PasswordCreationField isRequired>
          <Label>Default</Label>
        </PasswordCreationField>
      </ColumnLayout>,
    );

    await testScreenshot("PasswordCreationField edge cases");
  },
);
