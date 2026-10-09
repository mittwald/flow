import { afterEach, expect, test } from "vitest";
import CountryOptionsScenario from "./fixtures/CountryOptionsScenario.svelte";
import { cleanupRemote, renderRemote } from "./lib/environment.js";

/*
 * Flow ships the country names as locale files. Here they come from
 * `Intl.DisplayNames` in the host's language — the same data every browser
 * already carries, at the price of the browser's spelling rather than Flow's.
 *
 * What the test pins is the plumbing, not the spelling: the options are built
 * in the extension and reach the host as real `Option`s, sorted and filtered by
 * the props the app passed.
 */
afterEach(() => cleanupRemote());

/*
 * A `Select`'s options live in react-aria's collection until it opens, so the
 * assertion is on the remote tree: one `Option` per country the filter kept.
 * `value` is a remote *property*, not an attribute — reading it as one is how
 * this test would silently pass on a binding that never sent it.
 */
const remoteOptions = (remoteRoot: Element) => [
  ...remoteRoot.querySelectorAll("flr-option"),
];

test("renders the filtered countries as options the host can select", async () => {
  const { remote } = renderRemote(CountryOptionsScenario);

  await expect
    .poll(() => remoteOptions(remote).length, { timeout: 5000 })
    .toBe(3);

  const options = remoteOptions(remote);

  /*
   * Named by `Intl.DisplayNames` in the host's language and sorted by that
   * name, not by the code — which is why France comes first.
   */
  expect(options.map((option) => option.textContent)).toEqual([
    "France",
    "Germany",
    "United States",
  ]);

  expect(
    options.map((option) => (option as unknown as { value: string }).value),
  ).toEqual(["FR", "DE", "US"]);
});
