/**
 * One framework's half of the remote boundary.
 *
 * The host is React because it _is_ mStudio's backoffice; what varies is which
 * framework drives the remote side. A binding is therefore the unit this
 * harness iterates: adding Svelte means adding a file next to `react.ts` and
 * one key per scenario — nothing in the runner changes.
 *
 * `tree` is that binding's own shape (a `ReactElement`, a Vue render function,
 * a Svelte component), which is why it arrives as `unknown` and is narrowed
 * inside the binding. That single cast is the price of one runner for all of
 * them.
 */
export interface ParityBinding {
  /** How the binding is named in a failure, and the scenario key it reads. */
  readonly name: string;
  /**
   * Mounts a remote app that renders `tree` into `container`, talking to the
   * host through `receiver`, and returns what unmounts it again.
   */
  readonly mount: (
    tree: unknown,
    container: HTMLElement,
    receiver: unknown,
  ) => () => void;
}

/**
 * One list, written once per binding, plus what to do with it before reading.
 *
 * `trees` is keyed by binding name. A missing key fails the scenario rather
 * than skipping it: a binding that cannot express something is the finding this
 * harness exists to produce, and a silent skip would hide it.
 */
export interface ParityScenario {
  readonly name: string;
  readonly trees: Readonly<Record<string, () => unknown>>;
  /**
   * Runs against whichever binding is currently mounted, once per binding — so
   * it locates through `page.getByRole(…)`, which finds exactly one tree.
   */
  readonly interact?: () => Promise<void>;
}
