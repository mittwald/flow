import { render, fireEvent } from "@testing-library/react";
import React from "react";
import { assert, expect, test } from "vitest";
import { act } from "react";
import PasswordCreationField from "@/components/PasswordCreationField/PasswordCreationField";
import {
  Policy,
  type PolicyDeclaration,
} from "@mittwald/password-validation/policy";
import { RuleType } from "@mittwald/password-validation/rules";
import { Label } from "@/components/Label";
import { I18nProvider } from "react-aria";
import { IconPlus } from "@/components/Icon/components/icons";
import Button from "@/components/Button";

const policyDecl: PolicyDeclaration = {
  minComplexity: 3,
  rules: [
    {
      ruleType: RuleType.length,
      min: 8,
      max: 12,
    },
  ],
};

const policy = Policy.fromDeclaration(policyDecl);

describe("PasswordCreationField Tests", () => {
  test("renders empty list without errors", async () => {
    await act(() =>
      render(
        <I18nProvider locale="de">
          <PasswordCreationField validationPolicy={policy}>
            <Label>Password</Label>
          </PasswordCreationField>
        </I18nProvider>,
      ),
    );
  });

  test("shows complexity when password is entered", async () => {
    const renderResult = await act(() =>
      render(
        <I18nProvider locale="de">
          <PasswordCreationField validationPolicy={policy}>
            <Label>Password</Label>
          </PasswordCreationField>
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
    expect(complexityElement).toHaveAttribute("data-visible", "false");

    await act(() =>
      fireEvent.input(inputElement, { target: { value: "123" } }),
    );

    expect(complexityElement).toHaveAttribute("data-visible", "true");
  });

  test("shows password hints when clicking on info", async () => {
    const renderResult = await act(() =>
      render(
        <I18nProvider locale="de">
          <PasswordCreationField validationPolicy={policy}>
            <Label>Password</Label>
          </PasswordCreationField>
        </I18nProvider>,
      ),
    );

    const infoButton = renderResult.container.querySelector(
      'button[data-component="showPasswordRules"]',
    );
    assert(infoButton);

    await act(() => fireEvent.click(infoButton));

    const passwordRulesDialog = renderResult.getByRole("dialog");
    assert(passwordRulesDialog);

    const rules = passwordRulesDialog.querySelectorAll("span");
    expect(rules).toHaveLength(1);
  });

  test("will reveal and hide password when clicked", async () => {
    const renderResult = await act(() =>
      render(
        <I18nProvider locale="de">
          <PasswordCreationField validationPolicy={policy}>
            <Label>Password</Label>
          </PasswordCreationField>
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
          <PasswordCreationField validationPolicy={policy}>
            <Label>Password</Label>
          </PasswordCreationField>
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
    expect(complexityElement).toHaveAttribute("data-status", "danger");

    const generateButton = renderResult.container.querySelector(
      'button[data-component="generatePassword"]',
    );
    assert(generateButton);

    await act(() => fireEvent.click(generateButton));
    expect(inputElement.value).toHaveLength(12);
    expect(complexityElement).toHaveAttribute("data-status", "success");
  });

  test("will pass custom buttons to input area", async () => {
    const renderResult = await act(() =>
      render(
        <I18nProvider locale="de">
          <PasswordCreationField validationPolicy={policy}>
            <Label>Password</Label>
            <Button
              data-component="customButton"
              size="m"
              aria-label="Custom Button"
            >
              <IconPlus />
            </Button>
          </PasswordCreationField>
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

  test("controlled component mode", async () => {
    const onChangeHandler = vi.fn();

    const renderResult = await act(() =>
      render(
        <I18nProvider locale="de">
          <PasswordCreationField
            value="foo"
            onChange={onChangeHandler}
            validationPolicy={policy}
          >
            <Label>Password</Label>
          </PasswordCreationField>
        </I18nProvider>,
      ),
    );

    const inputElement = renderResult.container.querySelector("input");
    assert(inputElement);
    expect(inputElement).toHaveValue("foo");

    await act(() =>
      fireEvent.input(inputElement, { target: { value: "123" } }),
    );

    expect(onChangeHandler).toBeCalledWith("123");
    expect(inputElement).toHaveValue("foo");
  });

  test("uncontrolled component mode", async () => {
    const onChangeHandler = vi.fn();

    const renderResult = await act(() =>
      render(
        <I18nProvider locale="de">
          <PasswordCreationField
            onChange={onChangeHandler}
            validationPolicy={policy}
          >
            <Label>Password</Label>
          </PasswordCreationField>
        </I18nProvider>,
      ),
    );

    const inputElement = renderResult.container.querySelector("input");
    assert(inputElement);
    expect(inputElement).toHaveValue("");

    await act(() =>
      fireEvent.input(inputElement, { target: { value: "123" } }),
    );

    expect(onChangeHandler).toBeCalledWith("123");
    expect(inputElement).toHaveValue("123");
  });
});
