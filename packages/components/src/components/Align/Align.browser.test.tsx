import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { Align } from "@/components/Align";
import { Combine } from "@/components/Combine";
import { Text } from "@/components/Text";
import { IconInfo } from "@/components/Icon/components/icons";
import { DeprecationWarningProvider } from "@/components/DeprecationWarningProvider";

const content = (
  <>
    <IconInfo />
    <Text>mail.example.com</Text>
  </>
);

const htmlOf = (container: Element, testId: string): string =>
  container.querySelector(`[data-testid="${testId}"]`)?.innerHTML ?? "";

test("renders the same output as Combine", async () => {
  const screen = await render(
    <>
      <div data-testid="align">
        <Align>{content}</Align>
      </div>
      <div data-testid="combine">
        <Combine>{content}</Combine>
      </div>
    </>,
  );

  const align = htmlOf(screen.container, "align");

  expect(align).not.toBe("");
  expect(align).toBe(htmlOf(screen.container, "combine"));
});

test("warns that it is deprecated", async () => {
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
  const onWarning = vi.fn();

  await render(
    <DeprecationWarningProvider onWarning={onWarning}>
      <Align>{content}</Align>
    </DeprecationWarningProvider>,
  );

  await expect
    .poll(() => onWarning.mock.calls.flat())
    .toContain(
      "The 'Align' component is deprecated and will be removed in a future release. Use 'Combine' instead.",
    );
});
