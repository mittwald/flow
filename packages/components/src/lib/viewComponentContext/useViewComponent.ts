import { useContext, useMemo } from "react";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

type ViewSuffix = "View";
type ViewName<T> = `${T & string}${ViewSuffix}`;
type NotViewName<T> = T extends `${infer TBase}${ViewSuffix}` ? TBase : never;

type Entry<T extends keyof FlowViewComponents> = [
  T,
  NoInfer<FlowViewComponents[T]>,
];

export const useViewComponents = <
  T1 extends keyof FlowViewComponents,
  T2 extends keyof FlowViewComponents,
  T3 extends keyof FlowViewComponents,
  T4 extends keyof FlowViewComponents,
  T5 extends keyof FlowViewComponents,
  T6 extends keyof FlowViewComponents,
  T7 extends keyof FlowViewComponents,
  T8 extends keyof FlowViewComponents,
  T extends
    | [Entry<T1>]
    | [Entry<T1>, Entry<T2>]
    | [Entry<T1>, Entry<T2>, Entry<T3>]
    | [Entry<T1>, Entry<T2>, Entry<T3>, Entry<T4>]
    | [Entry<T1>, Entry<T2>, Entry<T3>, Entry<T4>, Entry<T5>]
    | [Entry<T1>, Entry<T2>, Entry<T3>, Entry<T4>, Entry<T5>, Entry<T6>]
    | [
        Entry<T1>,
        Entry<T2>,
        Entry<T3>,
        Entry<T4>,
        Entry<T5>,
        Entry<T6>,
        Entry<T7>,
      ]
    | [
        Entry<T1>,
        Entry<T2>,
        Entry<T3>,
        Entry<T4>,
        Entry<T5>,
        Entry<T6>,
        Entry<T7>,
        Entry<T8>,
      ],
>(
  ...entries: T
): {
  [Name in ViewName<T[number][0]>]: FlowViewComponents[NotViewName<Name>];
} => {
  const context = useContext(viewComponentContext);

  return useMemo(
    () =>
      Object.fromEntries(
        entries.map(([name, fallback]) => [
          `${name}View`,
          context[name] ?? fallback,
        ]),
      ),
    [],
  ) as never;
};
