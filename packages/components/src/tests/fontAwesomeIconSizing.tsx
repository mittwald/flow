import { dom } from "@fortawesome/fontawesome-svg-core";
import { render } from "vitest-browser-react";
import type { ReactNode } from "react";
import { Avatar } from "@/components/Avatar";
import { Heading } from "@/components/Heading";
import { Icon } from "@/components/Icon";
import { Link } from "@/components/Link";
import { Text } from "@/components/Text";

/*
 * FontAwesome's `fontawesome-svg-core` inserts its stylesheet as an unlayered
 * `<style>` element – `autoAddCss` defaults to true, so every consumer of
 * `@mittwald/flow-icons-pro` gets it. It sizes `.svg-inline--fa` itself
 * (`content-box`, `1.25em` × `1em`), which in the layered variant beats every
 * size Flow sets, its tokens and a context's alike.
 *
 * The icon is a bare `<svg>` rather than an icons-pro component, because the
 * pro icon definitions are not installable in every environment. What matters
 * for the cascade is that the element carries both the library's class and
 * Flow's – exactly what `FontAwesomeIcon` produces – and that the library's
 * stylesheet is the real one.
 *
 * Shared by both stylesheet variants: the fix lives in rules that each variant
 * builds differently.
 */
export const testFontAwesomeIconSizing = () => {
  beforeAll(() => {
    dom.insertCss();
  });

  const sizeOf = (element: Element) => {
    const { width, height } = element.getBoundingClientRect();
    return { width, height };
  };

  test("a FontAwesome icon keeps the border box sizing", async () => {
    const rendered = await render(
      <Icon className="svg-inline--fa">
        <svg />
      </Icon>,
    );
    const icon = rendered.getByLocator(".svg-inline--fa").element();

    expect(getComputedStyle(icon).boxSizing).toBe("border-box");
  });

  test("a FontAwesome icon sits on the baseline like any other icon", async () => {
    const rendered = await render(
      <Icon className="svg-inline--fa">
        <svg />
      </Icon>,
    );
    const icon = rendered.getByLocator(".svg-inline--fa").element();

    expect(getComputedStyle(icon).verticalAlign).toBe("baseline");
  });

  test.each([
    ["s", 16],
    ["m", 24],
    ["l", 64],
  ] as const)(
    "a FontAwesome icon of size %s keeps the token size",
    async (size, pixels) => {
      const rendered = await render(
        <Icon className="svg-inline--fa" size={size}>
          <svg />
        </Icon>,
      );

      expect(
        sizeOf(rendered.getByLocator(".svg-inline--fa").element()),
      ).toEqual({ width: pixels, height: pixels });
    },
  );

  const contexts: [string, (icon: ReactNode) => ReactNode][] = [
    ["Avatar", (icon) => <Avatar>{icon}</Avatar>],
    ["Heading", (icon) => <Heading>{icon}Heading</Heading>],
    ["Link", (icon) => <Link href="#">{icon}Link</Link>],
  ];

  test.each(contexts)(
    "a FontAwesome icon keeps the size %s sets",
    async (_, inContext) => {
      const rendered = await render(
        <>
          {inContext(
            <Icon data-testid="plain">
              <svg />
            </Icon>,
          )}
          {inContext(
            <Icon data-testid="fontawesome" className="svg-inline--fa">
              <svg />
            </Icon>,
          )}
        </>,
      );

      expect(sizeOf(rendered.getByTestId("fontawesome").element())).toEqual(
        sizeOf(rendered.getByTestId("plain").element()),
      );
    },
  );

  // The library's stylesheet also sets `vertical-align: -0.125em`.
  const aligningContexts: typeof contexts = [
    ["Heading", (icon) => <Heading>{icon}Heading</Heading>],
    ["Link", (icon) => <Link href="#">{icon}Link</Link>],
    ["Text", (icon) => <Text>{icon}Text</Text>],
  ];

  test.each(aligningContexts)(
    "a FontAwesome icon keeps the vertical alignment %s sets",
    async (_, inContext) => {
      const rendered = await render(
        <>
          {inContext(
            <Icon data-testid="plain">
              <svg />
            </Icon>,
          )}
          {inContext(
            <Icon data-testid="fontawesome" className="svg-inline--fa">
              <svg />
            </Icon>,
          )}
        </>,
      );
      const verticalAlignOf = (testId: string) =>
        getComputedStyle(rendered.getByTestId(testId).element()).verticalAlign;

      expect(verticalAlignOf("fontawesome")).toBe(verticalAlignOf("plain"));
    },
  );
};
