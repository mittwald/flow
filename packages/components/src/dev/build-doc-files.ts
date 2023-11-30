import { parse } from "react-docgen-typescript";
import * as fs from "fs";

const filterComponentFiles = (fileNameWithLocation: string) => {
  const fileName = fileNameWithLocation.split("/").pop();

  if (fileName === undefined) {
    return false;
  }

  return fileName.endsWith(".tsx") && !fileName.includes(".stories");
};

void (async () => {
  console.log("📚 Building component docs");
  const directory = "./src/components";
  const files = fs
    .readdirSync(directory, {
      recursive: true,
      encoding: "utf-8",
    })
    .filter(filterComponentFiles);

  const components = files
    .map((fileLocation) => {
      const location = `${directory}/${fileLocation}`;
      console.log(`📄 Parsing ${location}`);
      return parse(location);
    })
    .filter((component) => component.length > 0);

  console.log("📝 Writing to file");
  fs.writeFileSync("./dist/doc-gen.json", JSON.stringify(components, null, 2));

  console.log("✅ Done");
})();
