import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  FontAwesomeIcon,
  type FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import type { defaultIconSet } from "@mittwald/flow-icons";
import type { FC } from "react";
import { render } from "vitest-browser-react";
import { IconSetProvider } from "@/components/Icon";
import {
  IconCheckboxChecked,
  IconDelete,
} from "@/components/Icon/components/icons";

/*
 * `@mittwald/flow-icons-pro` cannot be imported here — the repo aliases the
 * FontAwesome Pro definitions to the free set, and its barrel pulls in icons
 * that set does not have. So the replacement set is built the way the package
 * generates it (`FontAwesomeIcon` around a definition), with the definitions
 * written out instead of installed, as `tests/layered/Icon.browser.test.tsx`
 * does for the same reason.
 */
const definition = (iconName: string, pathData: string): IconDefinition =>
  ({
    prefix: "far",
    iconName,
    icon: [448, 512, [], "", pathData],
  }) as IconDefinition;

const proIcon =
  (icon: IconDefinition): FC<Omit<FontAwesomeIconProps, "icon">> =>
  (props) => <FontAwesomeIcon icon={icon} {...props} />;

const proIconSet = {
  CheckboxChecked: proIcon(definition("square-check", "M64 80l320 0z")),
  Delete: proIcon(definition("trash-can", "M170 32l108 0z")),
} as unknown as typeof defaultIconSet;

const icons = (
  <>
    <IconCheckboxChecked aria-label="checked" />
    <IconDelete aria-label="delete" />
  </>
);

test("without a provider the icons come from the default set", async () => {
  const rendered = await render(icons);

  expect(rendered.getByLocator("[aria-label=checked]").element()).toHaveClass(
    "tabler-icon-square-check-filled",
  );
  expect(rendered.getByLocator("[aria-label=delete]").element()).toHaveClass(
    "tabler-icon-trash",
  );
});

test("IconSetProvider replaces them with the icons of the given set", async () => {
  const rendered = await render(
    <IconSetProvider set={proIconSet}>{icons}</IconSetProvider>,
  );

  for (const label of ["checked", "delete"]) {
    const icon = rendered.getByLocator(`[aria-label=${label}]`).element();

    expect(icon).toHaveClass("svg-inline--fa");
    expect(icon.className.baseVal).not.toContain("tabler-icon");
    // Flow's own icon styling keeps applying to the replacement.
    expect(icon).toHaveClass("flow--icon");
    expect(getComputedStyle(icon).boxSizing).toBe("border-box");
  }
});
