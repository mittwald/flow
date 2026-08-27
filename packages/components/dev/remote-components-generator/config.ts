export const config = {
  ignoreProps: [
    "controller",
    "tunnel",
    "ref",
    "key",
    "children",
    "dangerouslySetInnerHTML",
    "wrapWith",
    "style",
    /*
     * A render prop cannot cross the boundary: the host would call it and get
     * rendered output back, and a React element carries
     * `$$typeof: Symbol(react.…)`, which `postMessage` refuses — taking the whole
     * mutation batch down with it. So it never worked remotely, on any component.
     *
     * Nothing is lost. `GridList` inherits it from `Aria.GridListProps` and
     * overrides it internally anyway; the components that pick it deliberately
     * (Options, ComboBox, ContextMenu) keep it for local use — `ignoreProps` only
     * removes it from the generated remote surface. A remote empty state belongs
     * in a `ReactNode` slot, the way `List` and `CartesianChart` spell it
     * (`emptyView`).
     */
    "renderEmptyState",
  ],
} as const;
