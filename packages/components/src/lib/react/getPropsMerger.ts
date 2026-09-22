import { mergeRefs as mergeRefsFn } from "@react-aria/utils";
import { mergeProps as ariaMergeProps } from "@react-aria/utils";
import { isObjectType, sortBy } from "remeda";
import { setProperty } from "dot-prop";
import type { Ref } from "react";
import { getNestingLevel } from "@/lib/propsContext/nestedPropsContext/lib";

interface MergePropsOptions {
  mergeClassNames?: boolean;
  mergeEventHandler?: boolean;
  mergeRefs?: boolean;
}

export const getPropsMerger =
  (options: MergePropsOptions = {}): typeof ariaMergeProps =>
  (...propsList) => {
    const {
      mergeClassNames = true,
      mergeEventHandler = true,
      mergeRefs = true,
    } = options;

    const sortedByLevel = sortBy(
      propsList,
      getNestingLevel,
    ) as typeof propsList;

    const mergedProps = ariaMergeProps(...sortedByLevel);

    if (isObjectType(mergedProps)) {
      if (!mergeClassNames) {
        // "Unmerge" className
        for (const props of sortedByLevel) {
          if (
            isObjectType(props) &&
            "className" in mergedProps &&
            "className" in props
          ) {
            mergedProps.className = props.className;
          }
        }
      }

      if (!mergeEventHandler) {
        // "Unmerge" eventHandler
        for (const props of sortedByLevel) {
          if (isObjectType(props)) {
            for (const [propName, propValue] of Object.entries(props)) {
              const isEventHandlerProp = /^on[A-Z]/.test(propName);
              if (isEventHandlerProp) {
                setProperty(mergedProps, propName, propValue);
              }
            }
          }
        }
      }

      if (mergeRefs) {
        const refProps = Object.keys(mergedProps).filter(
          (p) => p === "ref" || p.endsWith("Ref"),
        );

        for (const refProp of refProps) {
          const collectedRefObjects = sortedByLevel
            .map((p) => (isObjectType(p) && refProp in p ? p[refProp] : null))
            // A ref nobody supplied contributes nothing. `undefined` used to
            // survive this filter and merge into a callback ref — harmless for
            // a ref the component attaches, fatal for one it reads instead
            // (`anchorRef`, `triggerRef`): nothing ever calls the callback, so
            // `.current` stays empty and the element is never found. Writing
            // `anchorRef={condition ? ref : undefined}` was enough to hit it.
            .filter((r): r is Ref<unknown> => r != null);

          setProperty(
            mergedProps,
            refProp,
            collectedRefObjects.length > 0
              ? mergeRefsFn(...collectedRefObjects)
              : undefined,
          );
        }
      }
    }

    return mergedProps;
  };
