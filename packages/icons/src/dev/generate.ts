import { generate } from "@mittwald/flow-icons-base";

await generate({
  iconsOutputFolder: import.meta.dirname + "/../components",
  vendor: "tb",
  iconSetName: "defaultIconSet",
});
