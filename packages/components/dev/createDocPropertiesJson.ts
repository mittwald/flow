import * as docgen from "react-docgen-typescript";
import * as fs from "fs/promises";
import * as fsSync from "fs";
import { glob } from "glob";

import crypto from "node:crypto";
import { ComponentDoc } from "react-docgen-typescript";
import { dirname, join } from "path";

interface CacheFile {
  hash: string;
  data: ComponentDoc[];
}

interface Component {
  fileLocation: string;
  fromCache: boolean;
  doc: ComponentDoc[];
}

const cacheDirectory = "./dev/.cache/docgen";
const fileHashLength = 10;

function hashString(input: string, length: number = 40) {
  return crypto
    .createHash("sha1")
    .update(input)
    .digest("hex")
    .substring(0, length);
}

function readCache(fileLocation: string): ComponentDoc[] | null {
  const filePath = join(
    cacheDirectory,
    hashString(fileLocation, fileHashLength),
  );

  if (!fsSync.existsSync(filePath)) {
    return null;
  }

  const fileHash = hashString(fsSync.readFileSync(fileLocation, "utf-8"));
  const cacheFile = JSON.parse(
    fsSync.readFileSync(filePath, "utf-8"),
  ) as CacheFile;

  if (fileHash != cacheFile.hash) {
    return null;
  }

  console.log(`⚡ Reading ${fileLocation} from cache`);

  return cacheFile.data;
}

async function writeCache(fileLocation: string, data: ComponentDoc[]) {
  const filePath = join(
    cacheDirectory,
    hashString(fileLocation, fileHashLength),
  );

  if (!fsSync.existsSync(dirname(filePath))) {
    await fs.mkdir(dirname(filePath), { recursive: true });
  }

  const fileHash = hashString(await fs.readFile(fileLocation, "utf-8"));

  await fs.writeFile(
    filePath,
    JSON.stringify({
      hash: fileHash,
      data,
    } satisfies CacheFile),
  );
}

async function createDocPropertiesJson() {
  const parser = docgen.withCustomConfig("./tsconfig.json", {
    skipChildrenPropWithoutDoc: false,
  });
  console.log("📚 Building component docs");
  const files = await glob("./src/components/**/*.tsx", {
    ignore: "src/**/*.stories.tsx",
  });
  const components = files.map((fileLocation) => {
    const cached = readCache(fileLocation);
    if (!cached) {
      console.log(`📄 Parsing ${fileLocation}`);
    }
    return {
      fileLocation,
      doc: cached ?? parser.parse(fileLocation),
      fromCache: Boolean(cached),
    } satisfies Component;
  });

  console.log("📝 Writing output file");
  if (!fsSync.existsSync("./out/")) {
    await fs.mkdir("./out/");
  }
  await fs.writeFile(
    "./out/doc-properties.json",
    JSON.stringify(
      components.flatMap((component) => component.doc),
      null,
      2,
    ),
  );

  for (const component of components) {
    if (!component.fromCache) {
      console.log(`🔥 Writing ${component.fileLocation} to cache`);
      await writeCache(component.fileLocation, component.doc);
    }
  }

  console.log("✅  Done");
}

void createDocPropertiesJson();
