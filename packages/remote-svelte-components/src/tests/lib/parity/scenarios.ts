/**
 * Scenarios both bindings render, described as data rather than as a tree.
 *
 * The visual suite in `remote-react-components` cannot take a third
 * environment: its scenarios are `(components) => ReactNode`, and a Svelte
 * binding has no way to render a React tree. A scenario that is data can be
 * built by both — `Render.svelte` walks it with the generated Svelte
 * components, `toReactElement` with the generated React ones — and then the two
 * host outputs have to agree.
 *
 * That agreement is the assertion. It is what catches a prop the Svelte wrapper
 * swallows, an event name it spells differently, or a child it nests one level
 * too deep — without a screenshot, and for every prop the scenario names.
 */
export interface ScenarioNode {
  /** A component exported by both packages' generated surface. */
  component: string;
  props?: Record<string, unknown>;
  children?: (ScenarioNode | string)[];
}

export interface ParityScenario {
  name: string;
  node: ScenarioNode;
}

export const parityScenarios: ParityScenario[] = [
  {
    name: "a button with its props",
    node: {
      component: "Button",
      props: { color: "danger", variant: "outline", size: "m" },
      children: ["Fire proton torpedo"],
    },
  },
  {
    name: "a disabled button",
    node: {
      component: "Button",
      props: { isDisabled: true },
      children: ["Grounded"],
    },
  },
  /*
   * The dashed props. `aria-label` limps along even when a binding camelizes
   * prop names, because the DOM reflects `ariaLabel` back onto the attribute;
   * `data-testid` has no such reflection and simply never arrives.
   */
  {
    name: "a button with dashed props",
    node: {
      component: "Button",
      props: { "data-testid": "fire", "aria-label": "Fire proton torpedo" },
      children: ["Fire"],
    },
  },
  {
    name: "a section with a heading and text",
    node: {
      component: "Section",
      children: [
        { component: "Heading", children: ["Squadron"] },
        { component: "Text", children: ["Twelve pilots ready"] },
      ],
    },
  },
  /*
   * A form field's `name` is also the wrapper's own prop — for usage reporting
   * and the props context. Passed as siblings the app's wins, the real one
   * never reaches the host, and the `FormData` the host collects is missing the
   * field.
   */
  {
    name: "a named text field",
    node: {
      component: "TextField",
      props: { name: "callsign" },
      children: [{ component: "Label", children: ["Call sign"] }],
    },
  },
  {
    name: "a named checkbox group",
    node: {
      component: "CheckboxGroup",
      props: { name: "clearance" },
      children: [
        { component: "Label", children: ["Clearance"] },
        {
          component: "Checkbox",
          props: { value: "archives" },
          children: ["Jedi Archives"],
        },
      ],
    },
  },
  {
    name: "a select with options",
    node: {
      component: "Select",
      props: { name: "homeworld", "aria-label": "Homeworld" },
      children: [
        {
          component: "Option",
          props: { value: "Tatooine", textValue: "Tatooine" },
          children: ["Tatooine"],
        },
        {
          component: "Option",
          props: { value: "Hoth", textValue: "Hoth" },
          children: ["Hoth"],
        },
      ],
    },
  },
  {
    name: "an alert with a heading, text and content",
    node: {
      component: "Alert",
      props: { status: "danger" },
      children: [
        { component: "Heading", children: ["Mission failed"] },
        { component: "Text", children: ["The assault could not be completed"] },
        {
          component: "Content",
          children: [{ component: "Button", children: ["Retry"] }],
        },
      ],
    },
  },
  {
    name: "a badge inside a label",
    node: {
      component: "Badge",
      props: { color: "red" },
      children: [
        { component: "Label", children: ["Shields"] },
        { component: "Text", children: ["down"] },
      ],
    },
  },
  {
    name: "a radio group with a default value",
    node: {
      component: "RadioGroup",
      props: { name: "rank", defaultValue: "commander" },
      children: [
        { component: "Label", children: ["Rank"] },
        {
          component: "Radio",
          props: { value: "commander" },
          children: ["Commander"],
        },
        { component: "Radio", props: { value: "pilot" }, children: ["Pilot"] },
      ],
    },
  },
  {
    name: "a class name the app passes",
    node: {
      component: "Section",
      props: { className: "squadron-section" },
      children: [{ component: "Heading", children: ["Squadron"] }],
    },
  },
];
