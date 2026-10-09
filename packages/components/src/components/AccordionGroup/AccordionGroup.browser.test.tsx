import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { expect, test, vi } from "vitest";
import { useState } from "react";
import type { Key } from "react-aria-components";
import { Accordion } from "@/components/Accordion";
import {
  AccordionGroup,
  type AccordionGroupProps,
} from "@/components/AccordionGroup";
import { Heading } from "@/components/Heading";
import { Content } from "@/components/Content";

const toggle = (name: string) => page.getByRole("button", { name });

const expectExpanded = (name: string, isExpanded: boolean) =>
  expect
    .element(toggle(name))
    .toHaveAttribute("aria-expanded", String(isExpanded));

const renderGroup = (
  props: AccordionGroupProps = {},
  defaultExpanded: { invoices?: boolean } = {},
) =>
  render(
    <AccordionGroup {...props}>
      <Accordion id="invoices" defaultExpanded={defaultExpanded.invoices}>
        <Heading>Invoices</Heading>
        <Content>The invoices.</Content>
      </Accordion>
      <Accordion id="contracts">
        <Heading>Contracts</Heading>
        <Content>The contracts.</Content>
      </Accordion>
    </AccordionGroup>,
  );

test("several accordions can be expanded by default", async () => {
  await renderGroup();

  await toggle("Invoices").click();
  await toggle("Contracts").click();

  await expectExpanded("Invoices", true);
  await expectExpanded("Contracts", true);
});

test("expanding one accordion collapses the others in single mode", async () => {
  await renderGroup({ allowsMultipleExpanded: false }, { invoices: true });

  await expectExpanded("Invoices", true);

  await toggle("Contracts").click();

  await expectExpanded("Invoices", false);
  await expectExpanded("Contracts", true);
});

test("defaultExpandedKeys expands the accordions with these ids", async () => {
  await renderGroup({ defaultExpandedKeys: ["contracts"] });

  await expectExpanded("Invoices", false);
  await expectExpanded("Contracts", true);
});

test("onExpandedChange reports every expanded accordion", async () => {
  const onExpandedChange = vi.fn();
  await renderGroup({ onExpandedChange }, { invoices: true });

  await toggle("Contracts").click();

  expect(onExpandedChange).toHaveBeenLastCalledWith(
    new Set(["invoices", "contracts"]),
  );
});

test("expandedKeys controls which accordions are expanded", async () => {
  const ControlledGroup = () => {
    const [expandedKeys, setExpandedKeys] = useState<Set<Key>>(
      new Set(["invoices"]),
    );
    return (
      <AccordionGroup
        allowsMultipleExpanded={false}
        expandedKeys={expandedKeys}
        onExpandedChange={setExpandedKeys}
      >
        <Accordion id="invoices">
          <Heading>Invoices</Heading>
          <Content>The invoices.</Content>
        </Accordion>
        <Accordion id="contracts">
          <Heading>Contracts</Heading>
          <Content>The contracts.</Content>
        </Accordion>
      </AccordionGroup>
    );
  };

  await render(<ControlledGroup />);

  await expectExpanded("Invoices", true);

  await toggle("Contracts").click();

  await expectExpanded("Invoices", false);
  await expectExpanded("Contracts", true);
});

test("an accordion inside an accordion's content is not part of the group", async () => {
  await render(
    <AccordionGroup allowsMultipleExpanded={false}>
      <Accordion defaultExpanded>
        <Heading>Invoices</Heading>
        <Content>
          <Accordion>
            <Heading>Details</Heading>
            <Content>The details.</Content>
          </Accordion>
        </Content>
      </Accordion>
    </AccordionGroup>,
  );

  await toggle("Details").click();

  await expectExpanded("Details", true);
  await expectExpanded("Invoices", true);
});
