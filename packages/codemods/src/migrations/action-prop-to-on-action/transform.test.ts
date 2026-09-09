import { describe, expect, test } from "vitest";
import { runTransform } from "../../tests/runTransform";

const transform = "action-prop-to-on-action";

describe(transform, () => {
  test("renames action and drops it when onAction already exists", () => {
    const source = `import { Action } from "@mittwald/flow-react-components";

export const A = () => (
  <>
    <Action action={run} />
    <Action action={stale} onAction={run} />
  </>
);
`;

    expect(runTransform(transform, source))
      .toBe(`import { Action } from "@mittwald/flow-react-components";

export const A = () => (
  <>
    <Action onAction={() => run()} />
    <Action onAction={() => run()} />
  </>
);
`);
  });

  test("wraps a bare identifier in a call", () => {
    const source = `import { Action } from "@mittwald/flow-react-components";

export const A = () => <Action action={close} />;
`;

    expect(runTransform(transform, source)).toContain(
      `onAction={() => close()}`,
    );
  });

  test("wraps a member expression, the case that motivated this", () => {
    // `controller.close` is typed `(options?: CloseOverlayOptions) => void`,
    // which is not assignable to `ActionFn`. Wrapping is what fixes it.
    const source = `import { Action } from "@mittwald/flow-react-components";

export const A = () => <Action action={controller.close} />;
`;

    expect(runTransform(transform, source)).toContain(
      `onAction={() => controller.close()}`,
    );
  });

  test("wraps a deep member expression and one off `this`", () => {
    const source = `import { Action } from "@mittwald/flow-react-components";

export const A = () => (
  <>
    <Action action={store.modal.controller.close} />
    <Action action={this.handleSave} />
  </>
);
`;

    const result = runTransform(transform, source);

    expect(result).toContain(`onAction={() => store.modal.controller.close()}`);
    expect(result).toContain(`onAction={() => this.handleSave()}`);
  });

  test("wraps a bare reference already written as onAction", () => {
    // A consumer who renamed the prop by hand — or ran an earlier version of
    // this codemod — still has the type error. The prop name is not what
    // decides the wrap; the value is.
    const source = `import { Action } from "@mittwald/flow-react-components";

export const A = () => <Action onAction={controller.close} />;
`;

    expect(runTransform(transform, source)).toContain(
      `onAction={() => controller.close()}`,
    );
  });

  test("leaves an inline arrow alone", () => {
    const source = `import { Action } from "@mittwald/flow-react-components";

export const A = () => (
  <>
    <Action action={() => controller.close()} />
    <Action action={async () => await save()} />
    <Action action={(...args) => log(args)} />
  </>
);
`;

    expect(runTransform(transform, source)).toBe(
      source.replace(/action=/g, "onAction="),
    );
  });

  test("leaves a function expression alone", () => {
    const source = `import { Action } from "@mittwald/flow-react-components";

export const A = () => (
  <>
    <Action action={function () { close(); }} />
    <Action action={function named() { close(); }} />
  </>
);
`;

    expect(runTransform(transform, source)).toBe(
      source.replace(/action=/g, "onAction="),
    );
  });

  test("leaves a call alone — it produces the handler, it is not the handler", () => {
    // `action={makeHandler()}` already evaluates to a function. Wrapping it
    // would call `makeHandler` on trigger and throw the handler away.
    const source = `import { Action } from "@mittwald/flow-react-components";

export const A = () => (
  <>
    <Action action={makeHandler()} />
    <Action action={close.bind(controller)} />
    <Action action={useCallback(close, [])} />
  </>
);
`;

    expect(runTransform(transform, source)).toBe(
      source.replace(/action=/g, "onAction="),
    );
  });

  test("leaves anything that is not a plain reference alone", () => {
    // A conditional or a fallback chain is not a bare reference, so wrapping it
    // would be a guess about which branch is the handler.
    const source = `import { Action } from "@mittwald/flow-react-components";

export const A = () => (
  <>
    <Action action={isOpen ? close : open} />
    <Action action={onClose ?? noop} />
    <Action action={controller?.close} />
  </>
);
`;

    expect(runTransform(transform, source)).toBe(
      source.replace(/action=/g, "onAction="),
    );
  });

  test("resolves an aliased and a namespace import", () => {
    const source = `import { Action as FlowAction } from "@mittwald/flow-react-components";
import * as Flow from "@mittwald/flow-remote-react-components";

export const A = () => (
  <>
    <FlowAction action={close} />
    <Flow.Action action={controller.close} />
  </>
);
`;

    const result = runTransform(transform, source);

    expect(result).toContain(`<FlowAction onAction={() => close()} />`);
    expect(result).toContain(
      `<Flow.Action onAction={() => controller.close()} />`,
    );
  });

  test("leaves another package's Action and a plain form alone", () => {
    const source = `import { Action } from "some-other-package";

export const A = () => (
  <>
    <Action action={close} />
    <form action={submitUrl} />
  </>
);
`;

    expect(runTransform(transform, source)).toBe(source);
  });

  test("leaves the props beside onAction untouched", () => {
    const source = `import { Action } from "@mittwald/flow-react-components";

export const A = () => <Action action={close} showFeedback break skip={2} />;
`;

    expect(runTransform(transform, source)).toContain(
      `<Action onAction={() => close()} showFeedback break skip={2} />`,
    );
  });
});

/**
 * Consumers run codemods one after another, so a second pass over already
 * migrated code has to be a no-op — see `src/tests/transformCoverage.test.ts`
 * for why every transform is required to prove this.
 *
 * The wrap is the interesting half here: it has to recognise its own output.
 * `onAction={() => close()}` is an arrow function, so the second pass leaves it
 * where it is instead of producing `() => (() => close())()`.
 */
describe("running it twice changes nothing", () => {
  test("stays idempotent", () => {
    const source = `import { Action } from "@mittwald/flow-react-components";

export const A = () => (
  <>
    <Action action={run} />
    <Action action={controller.close} />
    <Action action={stale} onAction={run} />
    <Action onAction={() => run()} />
    <Action action={() => run()} />
  </>
);
`;

    const once = runTransform(transform, source);
    expect(runTransform(transform, once)).toBe(once);
  });
});
