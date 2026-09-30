import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import type { ComponentProps } from "react";
import ContextMenu from "@/components/ContextMenu/ContextMenu";
import { ContextMenuSection } from "@/components/ContextMenu/components/ContextMenuSection";
import MenuItem from "@/components/MenuItem";
import { Button, ContextMenuTrigger } from "@/components/public";

const selectAll = page.getByRole("menuitem", {
  name: /^(Select|Deselect) all$/,
});
const item = (name: string) =>
  page.getByRole("menuitemcheckbox", { name, exact: true });

const selectionOfCall = (mock: ReturnType<typeof vitest.fn>, call = 0) => [
  ...(mock.mock.calls[call]?.[0] ?? []),
];

const renderMenu = async (props: ComponentProps<typeof ContextMenu>) => {
  await render(
    <ContextMenuTrigger>
      <Button>Open menu</Button>
      <ContextMenu selectionMode="multiple" showSelectAll {...props} />
    </ContextMenuTrigger>,
  );
  await userEvent.click(page.getByText("Open menu"));
};

const items = [
  <MenuItem key="a" id="a">
    A
  </MenuItem>,
  <MenuItem key="b" id="b">
    B
  </MenuItem>,
  <MenuItem key="c" id="c">
    C
  </MenuItem>,
];

test("selects and deselects all items with one change each", async () => {
  const onSelectionChange = vitest.fn();
  await renderMenu({ onSelectionChange, children: items });

  await userEvent.click(selectAll);
  expect(onSelectionChange).toHaveBeenCalledOnce();
  expect(selectionOfCall(onSelectionChange)).toEqual(["a", "b", "c"]);
  await expect.element(item("B")).toHaveAttribute("aria-checked", "true");
  await expect.element(selectAll).toHaveTextContent("Deselect all");

  onSelectionChange.mockClear();
  await userEvent.click(selectAll);
  expect(onSelectionChange).toHaveBeenCalledOnce();
  expect(selectionOfCall(onSelectionChange)).toEqual([]);
  await expect.element(item("B")).toHaveAttribute("aria-checked", "false");
});

test("completes a partial selection", async () => {
  await renderMenu({ defaultSelectedKeys: ["b"], children: items });

  await expect.element(selectAll).toHaveTextContent("Select all");
  await userEvent.click(selectAll);
  await expect.element(item("A")).toHaveAttribute("aria-checked", "true");
  await expect.element(item("C")).toHaveAttribute("aria-checked", "true");
});

test("skips disabled items and keeps their selection", async () => {
  const onSelectionChange = vitest.fn();
  await renderMenu({
    onSelectionChange,
    defaultSelectedKeys: ["c"],
    disabledKeys: ["b", "c"],
    children: items,
  });

  await userEvent.click(selectAll);
  expect(selectionOfCall(onSelectionChange).sort()).toEqual(["a", "c"]);
  await expect.element(selectAll).toHaveTextContent("Deselect all");

  await userEvent.click(selectAll);
  expect(selectionOfCall(onSelectionChange, 1)).toEqual(["c"]);
});

test("includes plain sections, but not sections with their own selection", async () => {
  const onSelectionChange = vitest.fn();
  await renderMenu({
    onSelectionChange,
    children: [
      <MenuItem key="a" id="a">
        A
      </MenuItem>,
      <ContextMenuSection key="plain">
        <MenuItem id="b">B</MenuItem>
      </ContextMenuSection>,
      <ContextMenuSection key="own" selectionMode="single">
        <MenuItem id="c">C</MenuItem>
      </ContextMenuSection>,
    ],
  });

  await userEvent.click(selectAll);
  expect(selectionOfCall(onSelectionChange)).toEqual(["a", "b"]);
  await expect
    .element(page.getByRole("menuitemradio", { name: "C" }))
    .toHaveAttribute("aria-checked", "false");
});

test("is only shown with multiple selection", async () => {
  await renderMenu({ selectionMode: "single", children: items });

  await expect
    .element(page.getByRole("menuitemradio", { name: "A" }))
    .toBeInTheDocument();
  expect(selectAll.query()).toBeNull();
});

test("is not shown without the prop", async () => {
  await renderMenu({ showSelectAll: false, children: items });

  await expect.element(item("A")).toBeInTheDocument();
  expect(selectAll.query()).toBeNull();
});
