import { render } from "vitest-browser-react";
import { useState } from "react";
import { beforeEach, expect, test, vitest } from "vitest";
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
import { page, userEvent } from "vitest/browser";
import { destroyAnnouncer } from "@react-aria/live-announcer";
import "@/lib/dev/vitest";
import { parkPointer } from "@/lib/dev/parkPointer";
import fieldErrorStyles from "@/components/FieldError/FieldError.module.scss";
import { FieldError } from "@/components/FieldError";

// Every test renders the same layout. A pointer left on a button hovers the
// next test's button, and its tooltip then swallows that test's Escape.
beforeEach(parkPointer);

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

const politeAnnouncements = (): string[] =>
  Array.from(
    document.querySelectorAll('[data-live-announcer] [aria-live="polite"] > *'),
  ).map((node) => node.textContent ?? "");

const describedByText = (input: Element): string[] =>
  (input.getAttribute("aria-describedby") ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .map((id) => document.getElementById(id)?.textContent ?? "");

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

/*
 * The policy hint is a rule to meet, not an error, until the password misses
 * it. The policy resolves asynchronously, so this runs on real timers and gives
 * it time to land.
 */
test("an empty field shows no error", async () => {
  await render(
    <PasswordCreationField>
      <Label>Password</Label>
    </PasswordCreationField>,
  );
  await expect.element(page.getByRole("textbox")).toBeVisible();
  await new Promise((resolve) => setTimeout(resolve, 500));

  expect(document.querySelector(`.${fieldErrorStyles.fieldError}`)).toBeNull();
});

const complexityIndicator = () =>
  document.querySelector("[data-complexity-status]");

const complexityStatus = () =>
  complexityIndicator()?.getAttribute("data-complexity-status");

/** Waits until the generated password is rated at full strength. */
const expectFullStrength = () =>
  expect
    .poll(
      () => complexityIndicator()?.getAttribute("data-complexity-percentage"),
      { timeout: 10_000 },
    )
    .toBe("100");

/*
 * The policy result for a valid password describes the input. It appears only
 * after the asynchronous validation, and a generated password never makes the
 * field invalid on the way – the input references the result only while it is
 * shown.
 */
test("a valid password's result describes the input", async () => {
  await render(
    <PasswordCreationField>
      <Label>Password</Label>
    </PasswordCreationField>,
  );
  const input = page.getByRole("textbox");
  await expect.element(input).toBeVisible();
  await expect.element(input).not.toHaveAttribute("aria-describedby");

  await page.getByRole("button", { name: /generate/i }).click();

  await expect.element(input).toHaveAccessibleDescription(/secure/);

  await userEvent.clear(input);

  await expect.element(input).not.toHaveAttribute("aria-describedby");
});

/*
 * A shown error hides the field's descriptions (FormField styles), so the
 * hidden result must not describe the input either – it would still be
 * announced.
 */
test("an error replaces a valid password's result", async () => {
  await render(
    <PasswordCreationField isInvalid>
      <Label>Password</Label>
      <FieldError>Already used</FieldError>
    </PasswordCreationField>,
  );
  const input = page.getByRole("textbox");
  await expect.element(input).toHaveAccessibleDescription(/Already used/);

  await page.getByRole("button", { name: /generate/i }).click();
  await expectFullStrength();

  await expect.element(input).toHaveAccessibleDescription(/Already used/);
  await expect.element(input).not.toHaveAccessibleDescription(/secure/);
});

/*
 * An error from outside the policy (a server error) makes the bar danger like
 * the field – a green bar next to an error reads as a contradiction.
 */
test("the bar of an invalid field shows danger for a strong password", async () => {
  const Field = ({ isInvalid }: { isInvalid: boolean }) => (
    <PasswordCreationField isInvalid={isInvalid}>
      <Label>Password</Label>
      <FieldError>Already used</FieldError>
    </PasswordCreationField>
  );
  const screen = await render(<Field isInvalid />);

  await page.getByRole("button", { name: /generate/i }).click();
  await expectFullStrength();

  expect(complexityStatus()).toBe("danger");

  await screen.rerender(<Field isInvalid={false} />);

  await expect.poll(complexityStatus).toBe("success");
});

/*
 * The generator only returns passwords its policy accepts, so the field shows
 * the policy's rating together with the password – not a guess that the real
 * rating overturns once the typing debounce has passed. With a short policy a
 * generated password lands at the minimum complexity, which the guess (full
 * strength) used to contradict.
 */
test("a generated password shows its final rating at once", async () => {
  const shortPolicy = Policy.fromDeclaration({
    minComplexity: 1,
    rules: [{ ruleType: RuleType.length, min: 2, max: 5 }],
  });
  await render(
    <PasswordCreationField validationPolicy={shortPolicy}>
      <Label>Password</Label>
    </PasswordCreationField>,
  );

  const shownStatuses: string[] = [];
  const recordStatus = () => {
    const indicator = complexityIndicator();
    const status = indicator?.getAttribute("data-complexity-status");
    const isVisible =
      indicator?.getAttribute("data-complexity-visible") === "true";
    if (isVisible && status && shownStatuses.at(-1) !== status) {
      shownStatuses.push(status);
    }
  };
  const observer = new MutationObserver(recordStatus);
  observer.observe(document.body, { subtree: true, attributes: true });

  await page.getByRole("button", { name: /generate/i }).click();
  await expect
    .poll(() => shownStatuses.length, { timeout: 10_000 })
    .toBeGreaterThan(0);
  // Past the typing debounce (350 ms), when the debounced validation runs: it
  // must leave the rating alone.
  await new Promise((resolve) => setTimeout(resolve, 1000));
  observer.disconnect();

  expect(shownStatuses).toEqual(["warning"]);
});

describe("PasswordCreationField Tests", () => {
  beforeEach(() => {
    vitest.resetAllMocks();
    vitest.useFakeTimers();
  });

  afterEach(() => {
    vitest.useRealTimers();
    destroyAnnouncer();
  });

  test("renders empty list without errors", async () => {
    await render(
      <I18nProvider locale="de">
        <PasswordCreationFieldTestComponent validationPolicy={policy}>
          <Label>Password</Label>
        </PasswordCreationFieldTestComponent>
      </I18nProvider>,
    );
    await vi.runAllTimersAsync();
  });

  test("shows complexity when password is entered", async () => {
    const renderResult = await render(
      <I18nProvider locale="de">
        <PasswordCreationFieldTestComponent validationPolicy={policy}>
          <Label>Password</Label>
        </PasswordCreationFieldTestComponent>
      </I18nProvider>,
    );
    await vi.runAllTimersAsync();

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
    await vi.runAllTimersAsync();

    expect(inputElement).toHaveDisplayValue("12");

    const infoButton = renderResult.getByLocator(
      'button[data-component="showPasswordRules"]',
    );

    await userEvent.click(infoButton);
    const rules = renderResult.getByLocator("[data-rule]");
    await expect.poll(() => rules.elements()).toHaveLength(1);
    await expect
      .element(rules.first())
      .toHaveAttribute("data-rule-valid", "true");
    expect(rules.first()).toHaveTextContent("Maximal 2 Zahlen");
    await userEvent.keyboard("{escape}");

    await userEvent.type(inputElement, "3");
    await vi.runAllTimersAsync();

    expect(inputElement).toHaveDisplayValue("123");

    await userEvent.click(infoButton);

    await expect.poll(() => rules.elements()).toHaveLength(1);
    await expect
      .element(rules.first())
      .toHaveAttribute("data-rule-valid", "false");
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
    await vi.runAllTimersAsync();

    const infoButton = renderResult.getByLocator(
      'button[data-component="showPasswordRules"]',
    );
    await userEvent.click(infoButton);

    const rules = renderResult.getByLocator("[data-rule]");
    await expect.poll(() => rules.elements()).toHaveLength(2);
  });

  test("will reveal and hide password when clicked", async () => {
    const renderResult = await render(
      <I18nProvider locale="de">
        <PasswordCreationFieldTestComponent validationPolicy={policy}>
          <Label>Password</Label>
        </PasswordCreationFieldTestComponent>
      </I18nProvider>,
    );
    await vi.runAllTimersAsync();

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
    await vi.runAllTimersAsync();

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
    await vi.runAllTimersAsync();

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

  test("labels the generate button with what it generates", async () => {
    const renderResult = await render(
      <I18nProvider locale="de">
        <PasswordCreationFieldTestComponent validationPolicy={policy}>
          <Label>Password</Label>
        </PasswordCreationFieldTestComponent>
      </I18nProvider>,
    );
    await vi.runAllTimersAsync();

    const generateButton = renderResult.getByLocator(
      'button[data-component="generatePassword"]',
    );

    expect(generateButton).toHaveAttribute("aria-label", "Passwort generieren");
    expect(generateButton).toHaveTextContent("Generieren");
  });

  test("describes the field with the rule the password misses", async () => {
    const renderResult = await render(
      <I18nProvider locale="de">
        <PasswordCreationFieldTestComponent validationPolicy={policy}>
          <Label>Password</Label>
        </PasswordCreationFieldTestComponent>
      </I18nProvider>,
    );
    await vi.runAllTimersAsync();

    const inputElement = renderResult.getByRole("textbox");
    await userEvent.type(inputElement, "abc");
    await vi.runAllTimersAsync();

    await expect
      .poll(() => describedByText(inputElement.element()))
      .toContain("Bitte wähle ein Passwort mit mindestens 8 Zeichen.");
  });

  test("announces the validation result", async () => {
    vitest.useRealTimers();

    const renderResult = await render(
      <I18nProvider locale="de">
        <PasswordCreationFieldTestComponent validationPolicy={policy}>
          <Label>Password</Label>
        </PasswordCreationFieldTestComponent>
      </I18nProvider>,
    );

    const inputElement = renderResult.getByRole("textbox");
    expect(politeAnnouncements()).toEqual([]);

    await userEvent.type(inputElement, "abc");
    await expect
      .poll(() => politeAnnouncements())
      .toContain("Bitte wähle ein Passwort mit mindestens 8 Zeichen.");

    await userEvent.clear(inputElement);
    await userEvent.type(inputElement, "d!iBCsc8(l~i");
    await expect
      .poll(() => politeAnnouncements())
      .toContain("Sehr gut! Dein Passwort ist sicher.");
  });

  test("announces when the password visibility changes", async () => {
    vitest.useRealTimers();

    const renderResult = await render(
      <I18nProvider locale="de">
        <PasswordCreationFieldTestComponent validationPolicy={policy}>
          <Label>Password</Label>
        </PasswordCreationFieldTestComponent>
      </I18nProvider>,
    );

    const revealButton = renderResult.getByLocator(
      'button[data-component="toggleRevealPassword"]',
    );
    expect(politeAnnouncements()).toEqual([]);

    await revealButton.click();
    await expect
      .poll(() => politeAnnouncements())
      .toContain("Passwort wird angezeigt");

    await revealButton.click();
    await expect
      .poll(() => politeAnnouncements())
      .toContain("Passwort wird verborgen");
  });

  test("shows the password rules as a labelled list with their status", async () => {
    const renderResult = await render(
      <I18nProvider locale="de">
        <PasswordCreationFieldTestComponent validationPolicy={policy}>
          <Label>Password</Label>
        </PasswordCreationFieldTestComponent>
      </I18nProvider>,
    );
    await vi.runAllTimersAsync();

    const infoButton = renderResult.getByLocator(
      'button[data-component="showPasswordRules"]',
    );
    await userEvent.click(infoButton);

    const rulesList = renderResult.getByRole("list", {
      name: "Anforderungen an dein Passwort",
    });
    expect(rulesList).toBeInTheDocument();

    const rules = rulesList.getByRole("listitem");
    await expect.poll(() => rules.elements()).toHaveLength(2);
    await expect
      .element(rules.first())
      .toHaveTextContent("Nicht erfüllt: Mindestens 8 Zeichen");

    await userEvent.keyboard("{escape}");
    await userEvent.type(renderResult.getByRole("textbox"), "abcdefgh1");
    await vi.runAllTimersAsync();
    await userEvent.click(infoButton);

    await expect
      .poll(() => rules.first().element().textContent)
      .toBe("Erfüllt: Mindestens 8 Zeichen");
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
    await vi.runAllTimersAsync();

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
    await vi.runAllTimersAsync();

    expect(onChangeHandler).not.toBeCalled();

    const inputElement = renderResult.getByRole("textbox");
    expect(inputElement).toHaveValue("");

    await userEvent.type(inputElement, "invalid");
    await vi.runAllTimersAsync();

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
    await vi.runAllTimersAsync();

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
