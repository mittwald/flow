import { mergeProps as ariaMergeProps } from "@react-aria/utils";
import { isObjectType } from "remeda";
import { setProperty } from "dot-prop";

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
