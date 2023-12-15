import * as docgen from "react-docgen-typescript";
import * as fs from "fs/promises";
import { glob } from "glob";

void (async () => {
  const parser = docgen.withCustomConfig("./tsconfig.json", {
    skipChildrenPropWithoutDoc: false,
  });
  console.log("📚 Building component docs");
  const files = await glob("./src/components/**/*.tsx", {
    ignore: "src/**/*.stories.tsx",
  });
  const components = files
    .map((fileLocation) => {
      console.log(`📄 Parsing ${fileLocation}`);
      return parser.parse(fileLocation);
    })
    .filter((component) => component.length > 0);

  console.log("📝 Writing to file");
  await fs.writeFile(
    "./dist/doc-properties.json",
    JSON.stringify(components, null, 2),
  );

  console.log("✅ Done");
})();
