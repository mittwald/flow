import { render, fireEvent, waitFor } from "@testing-library/react";
import React, { useState } from "react";
import { assert, expect, test } from "vitest";
import { act } from "react";
import PasswordCreationField from "@/components/PasswordCreationField/PasswordCreationField";
import {
  Policy,
  type PolicyDeclaration,
} from "@mittwald/password-tools-js/policy";
import { RuleType } from "@mittwald/password-tools-js/rules";
import { Label } from "@/components/Label";
import { I18nProvider } from "react-aria";
import { IconPlus } from "@/components/Icon/components/icons";
import Button from "@/components/Button";
import { sleep } from "@/lib/promises/sleep";

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
    await act(() =>
      render(
        <I18nProvider locale="de">
          <PasswordCreationFieldTestComponent validationPolicy={policy}>
            <Label>Password</Label>
          </PasswordCreationFieldTestComponent>
        </I18nProvider>,
      ),
    );
  });

  test("shows complexity when password is entered", async () => {
    const renderResult = await act(() =>
      render(
        <I18nProvider locale="de">
          <PasswordCreationFieldTestComponent validationPolicy={policy}>
            <Label>Password</Label>
          </PasswordCreationFieldTestComponent>
        </I18nProvider>,
      ),
    );

    const inputElement = renderResult.container.querySelector("input");
    assert(inputElement);
    expect(inputElement).toHaveValue("");

    const complexityElement = renderResult.container.querySelector(
      '[data-container="complexity"]',
    );
    assert(complexityElement);
    expect(complexityElement).toHaveAttribute(
      "data-complexity-visible",
      "false",
    );

    await act(async () => {
      fireEvent.change(inputElement, { target: { value: "123" } });
      await sleep(250);
    });

    await waitFor(() =>
      expect(complexityElement).toHaveAttribute(
        "data-complexity-visible",
        "true",
      ),
    );
  });

  test("shows correct password hint for max rule", async () => {
    const maxNumberPolicy = Policy.fromDeclaration({
      minComplexity: 3,
      rules: [
        {
          identifier: "numbers",
          ruleType: RuleType.charPool,
          charPools: ["numbers"],
          max: 2,
        },
      ],
    });

    const renderResult = await act(() =>
      render(
        <I18nProvider locale="de">
          <PasswordCreationFieldTestComponent
            validationPolicy={maxNumberPolicy}
          >
            <Label>Password</Label>
          </PasswordCreationFieldTestComponent>
        </I18nProvider>,
      ),
    );

    const inputElement = renderResult.container.querySelector("input");
    assert(inputElement);
    expect(inputElement).toHaveValue("");

    await act(async () => {
      fireEvent.change(inputElement, {
        target: { value: "12" },
      });
      await sleep(250);
    });

    const infoButton = renderResult.container.querySelector(
      'button[data-component="showPasswordRules"]',
    );
    assert(infoButton);

    await act(() => fireEvent.click(infoButton));

    const rules = renderResult.baseElement.querySelectorAll("[data-rule]");
    expect(rules).toHaveLength(1);
    expect(rules[0]).toHaveAttribute("data-rule-valid", "true");
    expect(rules[0]).toHaveTextContent("Maximal 2 Zahlen");

    await act(async () => {
      fireEvent.change(inputElement, {
        target: { value: "123" },
      });
      await sleep(250);
    });

    expect(rules[0]).toHaveAttribute("data-rule-valid", "false");
    expect(rules[0]).toHaveTextContent("Maximal 2 Zahlen");
  });

  test("shows password hints when clicking on info", async () => {
    const renderResult = await act(() =>
      render(
        <I18nProvider locale="de">
          <PasswordCreationFieldTestComponent validationPolicy={policy}>
            <Label>Password</Label>
          </PasswordCreationFieldTestComponent>
        </I18nProvider>,
      ),
    );

    const infoButton = renderResult.container.querySelector(
      'button[data-component="showPasswordRules"]',
    );
    assert(infoButton);

    await act(() => fireEvent.click(infoButton));

    const rules = renderResult.baseElement.querySelectorAll("[data-rule]");
    expect(rules).toHaveLength(2);
  });

  test("will reveal and hide password when clicked", async () => {
    const renderResult = await act(() =>
      render(
        <I18nProvider locale="de">
          <PasswordCreationFieldTestComponent validationPolicy={policy}>
            <Label>Password</Label>
          </PasswordCreationFieldTestComponent>
        </I18nProvider>,
      ),
    );

    const inputElement = renderResult.container.querySelector("input");
    assert(inputElement);
    expect(inputElement).toHaveAttribute("type", "password");

    const revealButton = renderResult.container.querySelector(
      'button[data-component="toggleRevealPassword"]',
    );
    assert(revealButton);

    await act(() => fireEvent.click(revealButton));
    expect(inputElement).toHaveAttribute("type", "text");

    await act(() => fireEvent.click(revealButton));
    expect(inputElement).toHaveAttribute("type", "password");
  });

  test("will generate a valid password when clicked", async () => {
    const renderResult = await act(() =>
      render(
        <I18nProvider locale="de">
          <PasswordCreationFieldTestComponent validationPolicy={policy}>
            <Label>Password</Label>
          </PasswordCreationFieldTestComponent>
        </I18nProvider>,
      ),
    );

    const inputElement = renderResult.container.querySelector("input");
    assert(inputElement);
    expect(inputElement).toHaveValue("");

    const complexityElement = renderResult.container.querySelector(
      '[data-container="complexity"]',
    );
    assert(complexityElement);
    expect(complexityElement).toHaveAttribute(
      "data-complexity-status",
      "danger",
    );

    const generateButton = renderResult.container.querySelector(
      'button[data-component="generatePassword"]',
    );
    assert(generateButton);

    await act(() => fireEvent.click(generateButton));
    expect(inputElement.value).toHaveLength(12);
    expect(complexityElement).toHaveAttribute(
      "data-complexity-status",
      "success",
    );
  });

  test("will pass custom buttons to input area", async () => {
    const renderResult = await act(() =>
      render(
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
      ),
    );

    const inputElement = renderResult.container.querySelector("input");
    assert(inputElement);
    expect(inputElement).toHaveValue("");

    const customButton = renderResult.container.querySelector(
      '[data-component="customButton"]',
    );
    expect(customButton).toBeInTheDocument();
  });

  test("emmit events", async () => {
    const onChangeHandler = vi.fn();
    const onValidationResult = vi.fn();

    const renderResult = await act(() =>
      render(
        <I18nProvider locale="de">
          <PasswordCreationFieldTestComponent
            onChange={onChangeHandler}
            onValidationResult={onValidationResult}
            validationPolicy={policy}
          >
            <Label>Password</Label>
          </PasswordCreationFieldTestComponent>
        </I18nProvider>,
      ),
    );
    expect(onChangeHandler).not.toBeCalled();

    const inputElement = renderResult.container.querySelector("input");
    assert(inputElement);
    expect(inputElement).toHaveValue("");

    await act(async () => {
      fireEvent.change(inputElement, {
        target: { value: "invalid" },
      });
      await sleep(250);
    });

    expect(onChangeHandler).toHaveBeenLastCalledWith("invalid");
    expect(onValidationResult).toHaveBeenLastCalledWith({
      password: "invalid",
      isValid: false,
    });
    expect(inputElement).toHaveValue("invalid");

    await act(async () => {
      fireEvent.change(inputElement, {
        target: { value: "d!iBCsc8(l~i" },
      });
      await sleep(250);
    });
    expect(onChangeHandler).toHaveBeenLastCalledWith("d!iBCsc8(l~i");
    expect(onValidationResult).toHaveBeenLastCalledWith({
      password: "d!iBCsc8(l~i",
      isValid: true,
    });
    expect(inputElement).toHaveValue("d!iBCsc8(l~i");
  });
});
