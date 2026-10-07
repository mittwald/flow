/*
 * The host receives `children: []` for every remote element, even one rendered
 * without children. Dropping the empty array gives a component `undefined`, as
 * it gets locally — `flowComponent`'s `useProps` does the same, this covers the
 * `@flr-generate` components that are plain function components.
 */
export const withoutEmptyChildren = <P extends object>(props: P): P => {
  if (
    "children" in props &&
    Array.isArray(props.children) &&
    props.children.length === 0
  ) {
    const { children: ignored, ...rest } = props;
    return rest as P;
  }
  return props;
};
