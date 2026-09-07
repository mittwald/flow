import * as RemoteComponents from "@/index";
import { renderLocal, renderRemote } from "@/tests/lib/environments";
import * as LocalComponents from "@mittwald/flow-react-components";
import { expect, test, vi } from "vitest";
import { page } from "vitest/browser";

/*
 * An Option infers its `textValue`, and from it its `value`, from the text
 * among its children. Remotely that text is not a string but a
 * RemoteTextRenderer element carrying it in `props.remote.data`, so the
 * inference has to hold on both sides — a helper that only understands plain
 * strings gives every remote Option react-aria's generated key (#3028).
 */

const environments = [
  {
    toString: () => "Local",
    render: renderLocal,
    components: LocalComponents,
  },
  {
    toString: () => "Remote",
    render: renderRemote,
    components: RemoteComponents,
  },
] as const;

const optionKeys = () =>
  Array.from(document.querySelectorAll("[role='option']")).map((option) =>
    option.getAttribute("data-key"),
  );

test.each(environments)(
  "an Option infers its key from the text among its children (%s)",
  async ({ render, components: { Badge, Label, Option, Select } }) => {
    const onChange = vi.fn();

    await render(
      <Select onChange={onChange}>
        <Label>Starship</Label>
        <Option>
          Millennium Falcon <Badge>Latest</Badge>
        </Option>
        <Option>X-Wing</Option>
      </Select>,
    );

    await page.getByRole("button", { name: "Starship" }).click();
    await expect.element(page.getByRole("listbox")).toBeVisible();

    await expect.poll(optionKeys).toEqual(["Millennium Falcon", "X-Wing"]);

    await page.getByRole("option", { name: /Millennium Falcon/ }).click();

    await expect.poll(() => onChange).toHaveBeenCalledWith("Millennium Falcon");
  },
);
