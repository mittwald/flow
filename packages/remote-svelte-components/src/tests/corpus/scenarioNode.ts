/**
 * A scenario, as something both bindings can build.
 *
 * The visual corpus in `remote-react-components` writes its scenarios as JSX
 * over an injected components bag. A React element is inert data — `{ type,
 * props, key }` — so the tree can be walked and rebuilt with this package's
 * components instead. That is what makes the corpus the contract rather than a
 * Svelte copy of it that drifts.
 */
export interface ComponentNode {
  kind: "component";
  /** The export name, which both packages use for the same component. */
  name: string;
  props: Record<string, unknown>;
  /**
   * Props whose value is rendered output. They are snippets here and travel as
   * slotted children — a rendered subtree does not survive structured clone.
   */
  slots: Record<string, ScenarioNode[]>;
  children: ScenarioNode[];
}

/** A plain DOM element — an `<svg>` an icon was bridged into, or a raw `<div>`. */
export interface ElementNode {
  kind: "element";
  tag: string;
  attributes: Record<string, string>;
  children: ScenarioNode[];
}

export interface TextNode {
  kind: "text";
  text: string;
}

export type ScenarioNode = ComponentNode | ElementNode | TextNode;

/**
 * A scenario this binding cannot express, named rather than skipped.
 *
 * A skip list would hide exactly the gap this harness exists to measure: which
 * parts of Flow's remote surface a non-React binding does not reach. So the
 * scenario fails, and the failure says which component did it.
 */
export class UnsupportedScenarioError extends Error {
  public readonly component: string;

  public constructor(component: string, reason: string) {
    super(
      `The Svelte binding cannot render "${component}": ${reason}. ` +
        "This is a gap in the binding, not in the scenario — see " +
        "packages/remote-svelte-components/README.md.",
    );
    this.name = "UnsupportedScenarioError";
    this.component = component;
  }
}
