import type { CategoricalColors } from "@/lib/tokens/CategoricalColors";

export const getCategoricalColorByIndex = (index: number) => {
  switch (index) {
    case 0:
      return "sea-green";
    case 1:
      return "palatinate-blue";
    case 2:
      return "tangerine";
    case 3:
      return "magenta";
    case 4:
      return "tropical-indigo";
    case 5:
      return "malachite";
    case 6:
      return "azure";
    case 7:
      return "violet";
    case 8:
      return "yellow";
    case 9:
      return "alloy-orange";
    case 10:
      return "green";
    default:
      return "lime";
  }
};
