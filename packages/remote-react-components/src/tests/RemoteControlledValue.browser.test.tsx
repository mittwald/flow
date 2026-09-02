import { testEnvironments } from "@/tests/lib/environments";
import type { ScenarioComponents } from "@/tests/lib/visualScenario";
import { useState } from "react";
import { expect, test, vitest } from "vitest";
import { page, userEvent } from "vitest/browser";

/*
 * A field the remote app controls reports every keystroke to the remote side and
 * gets the value back a round trip later. The host must not apply that echo — it
 * is already showing the character, and an echo of an earlier keystroke would
 * drop everything typed since. `useControlledRemoteValueProps` marks the echo
 * (`controlledRemoteValueMarker`) and `useControlledHostValueProps` renders its
 * own mirror of the value instead.
 *
 * A value the remote app sets itself carries no marker and has to arrive, or the
 * app could no longer drive its own field.
 *
 * That mirror is also what decides whether the field is controlled at all
 * (#3027), so a change to one of the two is a change to the other — which is
 * why both are asserted here. The `Local` environment runs the same trees
 * without a connection, so nothing is ever echoed there.
 */

const typedText = "correcthorsebattery";
const valueFromTheRemoteSide = "set by the remote app";

interface Props {
  components: ScenarioComponents;
  onChange?: (value: string) => void;
}

/** Value owned by the remote app — the echo path. */
const ControlledField = (props: Props) => {
  const { Button, Label, TextField } = props.components;
  const [value, setValue] = useState("");

  return (
    <>
      <TextField
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          props.onChange?.(newValue);
        }}
      >
        <Label>Passphrase</Label>
      </TextField>
      <Button onPress={() => setValue(valueFromTheRemoteSide)}>
        Overwrite
      </Button>
    </>
  );
};

/** Value owned by the field itself, the remote app only listens. */
const UncontrolledField = (props: Props) => {
  const { Label, TextField } = props.components;

  return (
    <TextField onChange={props.onChange}>
      <Label>Passphrase</Label>
    </TextField>
  );
};

const inputLocator = page.getByLocator("input");

const controlledSwitchWarnings = [
  "uncontrolled to controlled",
  "controlled to uncontrolled",
  "uncontrolled input to be controlled",
  "controlled input to be uncontrolled",
];

const expectNoControlledSwitch = async (
  type: () => Promise<void>,
): Promise<void> => {
  const warn = vitest.spyOn(console, "warn");
  const error = vitest.spyOn(console, "error");

  try {
    await type();

    const messages = [...warn.mock.calls, ...error.mock.calls]
      .flat()
      .join("\n");

    for (const warning of controlledSwitchWarnings) {
      expect(messages).not.toContain(warning);
    }
  } finally {
    warn.mockRestore();
    error.mockRestore();
  }
};

test.each(testEnvironments)(
  "a field the remote app controls keeps everything typed into it (%s)",
  async ({ render, components }) => {
    const onChange = vitest.fn();

    await render(
      <ControlledField components={components} onChange={onChange} />,
    );
    await expect.element(inputLocator).toBeVisible();

    await userEvent.type(inputLocator, typedText);

    await expect.poll(() => inputLocator.element().value).toBe(typedText);

    /*
     * Every reported change carries the whole text, so an echo the host applied
     * would show up as a value that is not a prefix of what was typed. The
     * remote side does not necessarily see every keystroke — a host event that
     * fires while a remote render is in flight is dropped, which is
     * load-dependent and has nothing to do with the echo.
     */
    for (const [reportedValue] of onChange.mock.calls) {
      expect(typedText.startsWith(reportedValue)).toBe(true);
    }
  },
);

test.each(testEnvironments)(
  "a value the remote app sets reaches the field (%s)",
  async ({ render, components }) => {
    await render(<ControlledField components={components} />);
    await expect.element(inputLocator).toBeVisible();

    await userEvent.type(inputLocator, typedText);
    await expect.poll(() => inputLocator.element().value).toBe(typedText);

    await page.getByRole("button", { name: "Overwrite" }).click();

    await expect
      .poll(() => inputLocator.element().value)
      .toBe(valueFromTheRemoteSide);
  },
);

test.each(testEnvironments)(
  "a field the remote app controls does not switch between controlled and uncontrolled (%s)",
  async ({ render, components }) => {
    await render(<ControlledField components={components} />);
    await expect.element(inputLocator).toBeVisible();

    await expectNoControlledSwitch(async () => {
      await userEvent.type(inputLocator, typedText);
      await expect.poll(() => inputLocator.element().value).toBe(typedText);
    });
  },
);

test.each(testEnvironments)(
  "a field the remote app does not control does not switch between controlled and uncontrolled (%s)",
  async ({ render, components }) => {
    const onChange = vitest.fn();

    await render(
      <UncontrolledField components={components} onChange={onChange} />,
    );
    await expect.element(inputLocator).toBeVisible();

    await expectNoControlledSwitch(async () => {
      await userEvent.type(inputLocator, typedText);
      await expect.poll(() => onChange).toHaveBeenCalled();
    });
  },
);
