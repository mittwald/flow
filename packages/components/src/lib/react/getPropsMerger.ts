import { mergeProps as ariaMergeProps } from "@react-aria/utils";
import { isObjectType } from "remeda";

interface MergePropsOptions {
  mergeClassNames?: boolean;
}

export const getPropsMerger =
  (options: MergePropsOptions = {}): typeof ariaMergeProps =>
  (...propsList) => {
    const { mergeClassNames = true } = options;
    const mergedProps = ariaMergeProps(...propsList);

    if (!mergeClassNames) {
      // "Unmerge" className
      for (const props of propsList) {
        if (
          isObjectType(mergedProps) &&
          isObjectType(props) &&
          "className" in mergedProps &&
          "className" in props
        ) {
          mergedProps.className = props.className;
        }
      }
    }

    return mergedProps;
  };
