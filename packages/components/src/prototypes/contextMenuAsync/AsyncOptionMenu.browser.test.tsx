import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { AsyncOptionMenu } from "./AsyncOptionMenu";
import { createFakeBackend } from "./lib/fakeBackend";

/*
 * The point of these tests is the claim the proposal in #1851 rests on: the
 * selection is independent of what is currently loaded or filtered. They drive
 * the real prototype against a server-side-filtering backend, with no fake
 * timers — the async paths are what is under test.
 */

const backend = () =>
  createFakeBackend({ total: 60, pageSize: 10, latencyMs: 20 });

const openMenu = async () => {
  await userEvent.click(page.getByRole("button", { name: /Labels/ }));
};

const searchFor = async (term: string) => {
  await userEvent.fill(page.getByRole("searchbox"), term);
};

/** The keys of the most recent `onSelectionChange` call, sorted. */
const lastSelection = (mock: {
  mock: { lastCall?: readonly unknown[] };
}): string[] => {
  const keys = mock.mock.lastCall?.[0];

  if (!(keys instanceof Set)) {
    throw new Error("onSelectionChange was not called with a Set");
  }

  return [...keys].map(String).sort();
};

test("selection survives a filter that hides the selected option", async () => {
  const onSelectionChange = vitest.fn();

  await render(
    <AsyncOptionMenu
      label="Labels"
      load={backend()}
      selectedOptionBehavior="inline"
      onSelectionChange={onSelectionChange}
    />,
  );

  await openMenu();

  // alpha-0 is on the first page.
  const alpha = page.getByRole("menuitemcheckbox", {
    name: "alpha-0",
    exact: true,
  });
  await expect.element(alpha).toBeInTheDocument();
  await userEvent.click(alpha);

  expect(lastSelection(onSelectionChange)).toEqual(["option-0"]);

  // Filter to something alpha-0 cannot match, then select a second option.
  await searchFor("beta-1");
  const beta = page.getByRole("menuitemcheckbox", {
    name: "beta-1",
    exact: true,
  });
  await expect.element(beta).toBeInTheDocument();

  // alpha-0 is gone from the collection …
  await expect
    .element(
      page.getByRole("menuitemcheckbox", { name: "alpha-0", exact: true }),
    )
    .not.toBeInTheDocument();

  await userEvent.click(beta);

  // … but it is still selected.
  expect(lastSelection(onSelectionChange)).toEqual(["option-0", "option-1"]);
});

test("a selected option stays visible and uncheckable while filtered out (pin)", async () => {
  await render(
    <AsyncOptionMenu
      label="Labels"
      load={backend()}
      selectedOptionBehavior="pin"
    />,
  );

  await openMenu();

  await userEvent.click(
    page.getByRole("menuitemcheckbox", { name: "alpha-0", exact: true }),
  );

  // A search that alpha-0 does not match still shows it, pinned.
  await searchFor("beta");

  const pinned = page.getByRole("menuitemcheckbox", {
    name: "alpha-0",
    exact: true,
  });
  await expect.element(pinned).toBeInTheDocument();
  await expect.element(pinned).toHaveAttribute("aria-checked", "true");

  // And it can be unchecked from there.
  await userEvent.click(pinned);
  await expect
    .element(page.getByRole("button", { name: "Labels" }))
    .toBeInTheDocument();
});

test("selection survives loading another page", async () => {
  const onSelectionChange = vitest.fn();

  await render(
    <AsyncOptionMenu
      label="Labels"
      load={backend()}
      selectedOptionBehavior="inline"
      onSelectionChange={onSelectionChange}
    />,
  );

  await openMenu();

  await userEvent.click(
    page.getByRole("menuitemcheckbox", { name: "alpha-0", exact: true }),
  );

  await userEvent.click(page.getByRole("button", { name: "Load more" }));

  // An option from the second page.
  const second = page.getByRole("menuitemcheckbox", {
    name: "gamma-10",
    exact: true,
  });
  await expect.element(second).toBeInTheDocument();

  // The first page's selection is still checked after the page grew.
  await expect
    .element(
      page.getByRole("menuitemcheckbox", { name: "alpha-0", exact: true }),
    )
    .toHaveAttribute("aria-checked", "true");

  await userEvent.click(second);

  expect(lastSelection(onSelectionChange)).toEqual(["option-0", "option-10"]);
});

test("the trigger reports the selection count across filter changes", async () => {
  await render(
    <AsyncOptionMenu
      label="Labels"
      load={backend()}
      selectedOptionBehavior="inline"
    />,
  );

  await openMenu();
  await userEvent.click(
    page.getByRole("menuitemcheckbox", { name: "alpha-0", exact: true }),
  );

  await searchFor("beta-1");
  await userEvent.click(
    page.getByRole("menuitemcheckbox", { name: "beta-1", exact: true }),
  );

  await expect
    .element(page.getByRole("button", { name: "Labels (2)" }))
    .toBeInTheDocument();
});
