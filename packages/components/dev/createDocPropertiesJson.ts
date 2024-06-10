import * as docgen from "react-docgen-typescript";
import * as fs from "fs/promises";
import * as fsSync from "fs";
import { glob } from "glob";

import crypto from "node:crypto";
import { ComponentDoc } from "react-docgen-typescript";
import { dirname, join, basename } from "path";
import * as zlibSync from "zlib";
import { promisify } from "node:util";

const gzip = promisify(zlibSync.gzip);

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
    zlibSync.gunzipSync(fsSync.readFileSync(filePath)).toString("utf8"),
  ) as CacheFile;

  if (fileHash != cacheFile.hash) {
    return null;
  }

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
    await gzip(
      JSON.stringify({
        hash: fileHash,
        data,
      } satisfies CacheFile),
    ),
  );
}

async function parse(): Promise<Component[]> {
  const parser = docgen.withCustomConfig("./tsconfig.json", {
    skipChildrenPropWithoutDoc: false,
    shouldRemoveUndefinedFromOptional: true,
    savePropValueAsString: true,
  });
  console.log("📚 Building component docs");
  const files = await glob("./src/components/**/*.tsx", {
    ignore: "src/**/*.stories.tsx",
  });
  return files.map((fileLocation) => {
    const cached = readCache(fileLocation);
    if (!cached) {
      console.log(`📄 Parsing ${basename(fileLocation)}`);
    }
    return {
      fileLocation,
      doc: cached ?? parser.parse(fileLocation),
      fromCache: Boolean(cached),
    } satisfies Component;
  });
}

async function createDocPropertiesJson() {
  const components = await parse();

  const cacheHits = components.filter(
    (component) => component.fromCache,
  ).length;

  if (cacheHits == components.length) {
    console.log("✅  No changes detected.");
    return;
  }

  console.log(`⚡ Read [${cacheHits}/${components.length}] files from cache`);

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
  console.log(
    `🔥 Writing ${components.filter((component) => !component.fromCache).length} files to cache`,
  );

  for (const component of components) {
    if (component.fromCache) {
      continue;
    }
    await writeCache(component.fileLocation, component.doc);
  }

  console.log("✅  Done");
}

void createDocPropertiesJson();
