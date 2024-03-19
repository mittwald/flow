import {
  FlowComponentName,
  propsContextSupportingComponents,
} from "@/components/propTypes";

export function isFlowComponentName(
  something: unknown,
): something is FlowComponentName {
  return (
    typeof something === "string" &&
    propsContextSupportingComponents.includes(something)
  );
}
