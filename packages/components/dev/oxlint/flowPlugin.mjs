import noBrandColorVariable from "./noBrandColorVariable.mjs";
import noUnknownFlowClass from "./noUnknownFlowClass.mjs";

export default {
  meta: { name: "flow" },
  rules: {
    "no-unknown-flow-class": noUnknownFlowClass,
    "no-brand-color-variable": noBrandColorVariable,
  },
};
