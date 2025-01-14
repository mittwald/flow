import type { FlowComponentName } from "~/components/propTypes";
import { propsContextSupportingComponents } from "~/components/propTypes";

export function isFlowComponentName(
  something: unknown,
): something is FlowComponentName {
  return (
    typeof something === "string" &&
    (propsContextSupportingComponents as string[]).includes(something)
  );
}
