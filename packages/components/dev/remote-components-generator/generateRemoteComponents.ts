import {
  generateRemoteReactComponentFile,
  generateRemoteReactComponentIndexFile,
} from "./generation/generateRemoteReactComponentFile";
import jp from "fs-jetpack";
import { prepareTypeScriptOutput } from "./generation/prepareTypeScriptOutput";
import {
  generateRemoteElementFile,
  generateRemoteElementIndexFile,
} from "./generation/generateRemoteElementFile";
import { config } from "./config";
import { checkTagIsSet } from "./lib/docTags";
import type { ComponentDoc } from "react-docgen-typescript";
import { remoteComponentNameOf } from "./lib/remoteComponentNameOf";
import { generateRemoteReactRendererComponentsFile } from "./generation/generateRemoteReactRendererComponentsFile";
import { remoteComponentBaseNameOf } from "./lib/remoteComponentBaseNameOf";
import { prop, sortBy } from "remeda";

const jetpack = jp.dir("../..");

async function generate() {
  console.log("🤓 Read component specification file");
  let components: ComponentDoc[] =
    (await jetpack.readAsync(
      "packages/components/out/doc-properties.json",
      "json",
    )) ?? [];

  console.log("✅  Done");
  console.log("");

  console.log("🧐 Parse component specification file");

  components = sortBy(
    components.filter((c) => checkTagIsSet(c.tags, "generate")),
    prop("filePath"),
  );

  console.log("✅  Done");
  console.log("");

  console.log("🛠 Applying config");
  for (const ignoredProp of config.ignoreProps) {
    console.log(` .. removing "${ignoredProp}" prop`);
    components.forEach((c) => {
      delete c.props[ignoredProp];
    });
  }

  console.log("✅  Done");
  console.log("");

  {
    console.log("📝️ Generating remote-react-component files");

    const dir = `packages/remote-react-components/src/auto-generated`;
    jetpack.remove(dir);

    for (const component of components) {
      const remoteReactComponentFile =
        generateRemoteReactComponentFile(component);
      await jetpack.writeAsync(
        `${dir}/${remoteComponentBaseNameOf(component)}.ts`,
        await prepareTypeScriptOutput(remoteReactComponentFile),
      );
    }
    const indexFile = generateRemoteReactComponentIndexFile(components);
    await jetpack.writeAsync(
      `${dir}/index.ts`,
      await prepareTypeScriptOutput(indexFile),
    );
    console.log("✅  Done");
    console.log("");
  }

  {
    console.log("📝️ Generating remote-element files");

    const dir = `packages/remote-elements/src/auto-generated`;
    const indexFile = generateRemoteElementIndexFile(components);

    jetpack.remove(dir);

    for (const component of components) {
      const remoteElementFile = generateRemoteElementFile(component);
      await jetpack.writeAsync(
        `${dir}/${remoteComponentNameOf(component)}.ts`,
        await prepareTypeScriptOutput(remoteElementFile),
      );
    }
    await jetpack.writeAsync(
      `${dir}/index.ts`,
      await prepareTypeScriptOutput(indexFile),
    );
    console.log("✅  Done");
    console.log("");
  }

  {
    console.log("📝️ Generating React-renderer map file");

    const dir = `packages/remote-react-renderer/src/auto-generated`;
    const content = generateRemoteReactRendererComponentsFile(components);
    jetpack.remove(dir);

    await jetpack.writeAsync(
      `${dir}/index.ts`,
      await prepareTypeScriptOutput(content),
    );

    console.log("✅  Done");
  }

  console.log("");
  console.log("✅  Generation finished successfully");
}

void generate();
