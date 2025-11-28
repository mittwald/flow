import { render } from "vitest-browser-react";
import { useState } from "react";
import { expect, test } from "vitest";
import PasswordCreationField from "@/components/PasswordCreationField/PasswordCreationField";
import {
  Policy,
  RuleType,
  type PolicyDeclaration,
} from "@/integrations/@mittwald/password-tools-js";
import { Label } from "@/components/Label";
import { I18nProvider } from "react-aria";
import { IconPlus } from "@/components/Icon/components/icons";
import Button from "@/components/Button";
import { userEvent } from "vitest/browser";
import "@/lib/dev/vitest";

const policyDecl: PolicyDeclaration = {
  minComplexity: 3,
  rules: [
    {
      ruleType: RuleType.length,
      min: 8,
      max: 12,
    },
    {
      identifier: "numbers",
      ruleType: RuleType.charPool,
      charPools: ["numbers"],
      min: 1,
    },
  ],
};

const policy = Policy.fromDeclaration(policyDecl);

const PasswordCreationFieldTestComponent: typeof PasswordCreationField = (
  props,
) => {
  const [password, setPassword] = useState("");
  return (
    <PasswordCreationField
      {...props}
      aria-label="test"
      value={password}
      onChange={(value) => {
        setPassword(value);
        props.onChange?.(value);
      }}
    />
  );
};

describe("PasswordCreationField Tests", () => {
  test("renders empty list without errors", async () => {
    await render(
      <I18nProvider locale="de">
        <PasswordCreationFieldTestComponent validationPolicy={policy}>
          <Label>Password</Label>
        </PasswordCreationFieldTestComponent>
      </I18nProvider>,
    );
  });

  test("shows complexity when password is entered", async () => {
    const renderResult = await render(
      <I18nProvider locale="de">
        <PasswordCreationFieldTestComponent validationPolicy={policy}>
          <Label>Password</Label>
        </PasswordCreationFieldTestComponent>
      </I18nProvider>,
    );

    const inputElement = renderResult.getByRole("textbox");
    const complexityElement = renderResult.getByLocator(
      '[data-container="complexity"]',
    );
    expect(inputElement).toHaveValue("");
    expect(complexityElement).toHaveAttribute(
      "data-complexity-visible",
      "false",
    );

    await userEvent.type(inputElement, "123");

    expect(complexityElement).toHaveAttribute(
      "data-complexity-visible",
      "true",
    );
  });

  test("shows correct password hint for max rule", async () => {
    const maxNumberPolicy = Policy.fromDeclaration({
      minComplexity: 0,
      rules: [
        {
          identifier: "numbers",
          ruleType: RuleType.charPool,
          charPools: ["numbers"],
          max: 2,
        },
      ],
    });

    const renderResult = await render(
      <I18nProvider locale="de">
        <PasswordCreationFieldTestComponent validationPolicy={maxNumberPolicy}>
          <Label>Password</Label>
        </PasswordCreationFieldTestComponent>
      </I18nProvider>,
    );

    const inputElement = renderResult.getByRole("textbox");
    expect(inputElement).toHaveDisplayValue("");

    await userEvent.type(inputElement, "12");
    expect(inputElement).toHaveDisplayValue("12");

    const infoButton = renderResult.getByLocator(
      'button[data-component="showPasswordRules"]',
    );

    await userEvent.click(infoButton);
    const rules = renderResult.getByLocator("[data-rule]");
    expect(rules).toHaveLength(1);
    expect(rules.first()).toHaveAttribute("data-rule-valid", "true");
    expect(rules.first()).toHaveTextContent("Maximal 2 Zahlen");
    await userEvent.keyboard("{escape}");

    await userEvent.type(inputElement, "3");
    expect(inputElement).toHaveDisplayValue("123");

    await userEvent.click(infoButton);

    expect(rules).toHaveLength(1);
    expect(rules.first()).toHaveAttribute("data-rule-valid", "false");
    expect(rules.first()).toHaveTextContent("Maximal 2 Zahlen");
  });

  test("shows password hints when clicking on info", async () => {
    const renderResult = await render(
      <I18nProvider locale="de">
        <PasswordCreationFieldTestComponent validationPolicy={policy}>
          <Label>Password</Label>
        </PasswordCreationFieldTestComponent>
      </I18nProvider>,
    );

    const infoButton = renderResult.getByLocator(
      'button[data-component="showPasswordRules"]',
    );
    await userEvent.click(infoButton);

    const rules = renderResult.getByLocator("[data-rule]");
    expect(rules).toHaveLength(2);
  });

  test("will reveal and hide password when clicked", async () => {
    const renderResult = await render(
      <I18nProvider locale="de">
        <PasswordCreationFieldTestComponent validationPolicy={policy}>
          <Label>Password</Label>
        </PasswordCreationFieldTestComponent>
      </I18nProvider>,
    );

    const inputElement = renderResult.getByRole("textbox");
    expect(inputElement).toHaveAttribute("type", "password");

    const revealButton = renderResult.getByLocator(
      'button[data-component="toggleRevealPassword"]',
    );

    await userEvent.click(revealButton);
    expect(inputElement).toHaveAttribute("type", "text");

    await userEvent.click(revealButton);
    expect(inputElement).toHaveAttribute("type", "password");
  });

  test("will generate a valid password when clicked", async () => {
    const renderResult = await render(
      <I18nProvider locale="de">
        <PasswordCreationFieldTestComponent validationPolicy={policy}>
          <Label>Password</Label>
        </PasswordCreationFieldTestComponent>
      </I18nProvider>,
    );

    const inputElement = renderResult.getByRole("textbox");
    expect(inputElement).toHaveValue("");

    const complexityElement = renderResult.getByLocator(
      '[data-container="complexity"]',
    );
    expect(complexityElement).toHaveAttribute(
      "data-complexity-visible",
      "false",
    );

    const generateButton = renderResult.getByLocator(
      'button[data-component="generatePassword"]',
    );

    await userEvent.click(generateButton);

    await expect
      .poll(() => expect(inputElement).toHaveDisplayValue(/^.{12}$/))
      .toBeTruthy();

    expect(complexityElement).toHaveAttribute(
      "data-complexity-visible",
      "true",
    );
    expect(complexityElement).toHaveAttribute(
      "data-complexity-status",
      "success",
    );
  });

  test("will pass custom buttons to input area", async () => {
    const renderResult = await render(
      <I18nProvider locale="de">
        <PasswordCreationFieldTestComponent validationPolicy={policy}>
          <Label>Password</Label>
          <Button
            data-component="customButton"
            size="m"
            aria-label="Custom Button"
          >
            <IconPlus />
          </Button>
        </PasswordCreationFieldTestComponent>
      </I18nProvider>,
    );

    const inputElement = renderResult.getByRole("textbox");
    expect(inputElement).toHaveValue("");

    const customButton = renderResult.getByLocator(
      '[data-component="customButton"]',
    );
    expect(customButton).toBeInTheDocument();
  });

  test("emmit events", async () => {
    const onChangeHandler = vi.fn();
    const onValidationResult = vi.fn();

    const renderResult = await render(
      <I18nProvider locale="de">
        <PasswordCreationFieldTestComponent
          onChange={onChangeHandler}
          onValidationResult={onValidationResult}
          validationPolicy={policy}
        >
          <Label>Password</Label>
        </PasswordCreationFieldTestComponent>
      </I18nProvider>,
    );
    expect(onChangeHandler).not.toBeCalled();

    const inputElement = renderResult.getByRole("textbox");
    expect(inputElement).toHaveValue("");

    await userEvent.type(inputElement, "invalid");
    expect(onChangeHandler).toHaveBeenLastCalledWith("invalid");
    await expect
      .poll(() =>
        expect(onValidationResult).toHaveBeenLastCalledWith({
          password: "invalid",
          isValid: false,
        }),
      )
      .toBeTruthy();
    expect(inputElement).toHaveValue("invalid");

    await userEvent.clear(inputElement);
    await userEvent.type(inputElement, "d!iBCsc8(l~i");
    expect(onChangeHandler).toHaveBeenLastCalledWith("d!iBCsc8(l~i");
    await expect
      .poll(() =>
        expect(onValidationResult).toHaveBeenLastCalledWith({
          password: "d!iBCsc8(l~i",
          isValid: true,
        }),
      )
      .toBeTruthy();

    expect(inputElement).toHaveValue("d!iBCsc8(l~i");
  });
});
