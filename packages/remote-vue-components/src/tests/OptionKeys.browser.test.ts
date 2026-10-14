import { Badge, Label, Option, Select } from "@/index";
import { cleanupRemote, renderRemote } from "@/tests/lib/environment";
import { page } from "vitest/browser";
import { afterEach, expect, test, vi } from "vitest";
import { defineComponent, h } from "vue";

/*
 * The Vue counterpart of the React package's test of the same name.
 *
 * An Option infers its `textValue`, and from it its `value`, from the text
 * among its children. Remotely that text is not a string but a
 * RemoteTextRenderer element carrying it in `props.remote.data`, so the
 * inference has to hold on the host side — a helper that only understands plain
 * strings gives every remote Option react-aria's generated key (#3028). Vue
 * produces the same text nodes React does, so the same inference has to work.
 */
afterEach(() => cleanupRemote());

const optionKeys = () =>
  Array.from(document.querySelectorAll("[role='option']")).map((option) =>
    option.getAttribute("data-key"),
  );

test("an Option infers its key from the text among its children", async () => {
  const onChange = vi.fn();

  renderRemote(
    defineComponent(
      () => () =>
        h(Select, { onChange }, () => [
          h(Label, null, () => "Starship"),
          h(Option, null, () => [
            "Millennium Falcon ",
            h(Badge, null, () => "Latest"),
          ]),
          h(Option, null, () => "X-Wing"),
        ]),
    ),
  );

  await page.getByRole("button", { name: "Starship" }).click();
  await expect.element(page.getByRole("listbox")).toBeVisible();

  await expect.poll(optionKeys).toEqual(["Millennium Falcon", "X-Wing"]);

  await page.getByRole("option", { name: /Millennium Falcon/ }).click();

  await expect.poll(() => onChange).toHaveBeenCalledWith("Millennium Falcon");
});
