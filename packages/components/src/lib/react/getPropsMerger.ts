import { mergeProps as ariaMergeProps } from "@react-aria/utils";
import { isObjectType } from "remeda";
import { setProperty } from "dot-prop";
import type { FlowRenderFn } from "@/lib/types/props";

interface MergePropsOptions {
  mergeClassNames?: boolean;
  mergeEventHandler?: boolean;
}

export const getPropsMerger =
  (options: MergePropsOptions = {}): typeof ariaMergeProps =>
  (...propsList) => {
    const { mergeClassNames = true, mergeEventHandler = true } = options;
    const mergedProps = ariaMergeProps(...propsList);

    if (isObjectType(mergedProps)) {
      if (!mergeClassNames) {
        // "Unmerge" className
        for (const props of propsList) {
          if (
            isObjectType(props) &&
            "className" in mergedProps &&
            "className" in props
          ) {
            mergedProps.className = props.className;
          }
        }

        if ("render" in mergedProps) {
          let mergedRender: FlowRenderFn<never> | undefined = undefined;

          for (const props of propsList) {
            if (isObjectType(props) && "render" in props) {
              if (!mergedRender) {
                mergedRender = props.render;
                continue;
              }

              const prevRender = mergedRender;
              const currentRender = props.render;

              mergedRender = (Component, renderProps) =>
                currentRender(
                  (p: never) => prevRender(Component, p),
                  renderProps,
                );
            }
          }

          mergedProps.render = mergedRender;
        }
      }

      if (!mergeEventHandler) {
        // "Unmerge" eventHandler
        for (const props of propsList) {
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
    }

    return mergedProps;
  };
