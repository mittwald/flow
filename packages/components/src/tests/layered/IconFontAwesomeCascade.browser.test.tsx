import { dom } from "@fortawesome/fontawesome-svg-core";
import { render } from "vitest-browser-react";
import { beforeAll, expect, test } from "vitest";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Link } from "@/components/Link";
import { Label } from "@/components/Label";
import { NumberField } from "@/components/NumberField";
import { SegmentedControl } from "@/components/SegmentedControl";
import { Segment } from "@/components/SegmentedControl/components/Segment";
import { Text } from "@/components/Text";
import { IconCheck } from "@/components/Icon/components/icons";

/*
 * FontAwesome's unlayered stylesheet sets `display` and `vertical-align` on
 * `.svg-inline--fa`, which beats every layered rule a component sets on its
 * icon: a context that hides an icon or aligns it. `Icon` hands both back to
 * the layered rules.
 *
 * The icons here are Flow's own, marked as FontAwesome icons afterwards – what
 * matters for the cascade is that the element carries the library's class and
 * Flow's, exactly as `FontAwesomeIcon` renders it.
 */
beforeAll(() => {
  dom.insertCss();
});

const markAsFontAwesome = () => {
  document
    .querySelectorAll("svg.flow--icon")
    .forEach((svg) => svg.classList.add("svg-inline--fa"));
};

const iconsIn = (selector: string) =>
  Array.from(document.querySelectorAll<SVGElement>(`${selector} svg`));

const styleOfIcon = (selector: string, index: number) => {
  const icon = iconsIn(selector)[index];
  if (!icon) {
    throw new Error(`No icon ${index} in "${selector}"`);
  }
  return getComputedStyle(icon);
};

test("no separator follows the last breadcrumb step", async () => {
  await render(
    <Breadcrumb>
      <Link href="#org">Rebel Alliance</Link>
      <Link href="#page" aria-current="page">
        Hangar
      </Link>
    </Breadcrumb>,
  );
  markAsFontAwesome();

  expect(styleOfIcon("ol li", 0).display).not.toBe("none");
  expect(styleOfIcon("ol li", 1).display).toBe("none");
});

test("only the selected segment shows its checkmark", async () => {
  await render(
    <SegmentedControl defaultValue="list">
      <Label>View</Label>
      <Segment value="list">List</Segment>
      <Segment value="grid">Grid</Segment>
    </SegmentedControl>,
  );
  markAsFontAwesome();

  expect(styleOfIcon("label", 0).display).not.toBe("none");
  expect(styleOfIcon("label", 1).display).toBe("none");
});

test("the number field hides the icons of the other pointer type", async () => {
  await render(
    <NumberField>
      <Label>Droids</Label>
    </NumberField>,
  );
  markAsFontAwesome();

  const displays = iconsIn("button").map(
    (svg) => getComputedStyle(svg).display,
  );

  expect(displays.filter((display) => display === "none")).toHaveLength(2);
});

test("an icon in a text keeps the alignment the text sets", async () => {
  await render(
    <Text>
      <IconCheck />
      Hangar
    </Text>,
  );
  markAsFontAwesome();

  expect(styleOfIcon("p, span", 0).verticalAlign).toBe("text-bottom");
});
