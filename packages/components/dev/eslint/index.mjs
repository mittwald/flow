import flowComponentName from "./flowComponentName.mjs";
import noUnknownFlowClass from "./noUnknownFlowClass.mjs";

/** Flow's own ESLint rules, registered under the `flow/` prefix. */
export default {
  rules: {
    "flow-component-name": flowComponentName,
    "no-unknown-flow-class": noUnknownFlowClass,
  },
};
