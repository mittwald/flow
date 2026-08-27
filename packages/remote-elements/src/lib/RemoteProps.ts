/*
 * react-aria types `className` as `string | ((renderProps) => string)`, and Flow
 * components pass that through. The function form cannot cross the thread
 * boundary: the host is the side that calls it, so it has to send the render
 * props over — and for a collection component those carry the collection state,
 * which holds the rendered React elements of every row and cell. Those carry
 * `$$typeof: Symbol(react.…)`, which `postMessage` refuses.
 *
 * `FlowThreadSerialization` drops React values rather than losing the whole
 * batch, so it degrades instead of breaking: the callback still runs, but every
 * render ships an entire collection whose elements arrive as `null`. Narrowing
 * the remote surface to a string turns that into a compile error at the one
 * place where it can still be avoided.
 *
 * Conditional on purpose — a component without `className` is left untouched
 * rather than gaining one.
 */
export type WithSerializableClassName<T> = "className" extends keyof T
  ? Omit<T, "className"> & { className?: string }
  : T;
