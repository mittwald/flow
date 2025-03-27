import tokens from "@mittwald/flow-design-tokens/variables.json";
import type { CategoricalColors } from "./CategoricalColors";

export const getCategoricalColorValue = (color: CategoricalColors) => {
  return tokens.color.categorical[color].value;
};
