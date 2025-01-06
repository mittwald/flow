import { ComponentFileLoader } from "./loading/ComponentFileLoader";
import { ComponentFileContentLoader } from "./loading/ComponentFileContentLoader";
import {
  generateRemoteReactComponentFile,
  generateRemoteReactComponentIndexFile,
} from "./generation/generateRemoteReactComponentFile";
import jetpack from "fs-jetpack";
import { prepareTypeScriptOutput } from "./generation/prepareTypeScriptOutput";
import { generateRemoteElementFile } from "./generation/generateRemoteElementFile";
import { remoteComponentGeneratorConfig } from "./config";

const componentFileLoader = new ComponentFileLoader();
const componentFileContentLoader = new ComponentFileContentLoader(
  componentFileLoader,
);

async function generate() {
  const config = remoteComponentGeneratorConfig;

  console.log("🤓 Read component specification file");
  const componentSpecificationFile = await componentFileLoader.loadFile();
  console.log("✅  Done");
  console.log("");

  console.log("🧐 Parse component specification file");
  let components = await componentFileContentLoader.parseJson(
    componentSpecificationFile,
  );
  console.log("✅  Done");
  console.log("");

  console.log("💣 Remove ignored components");
  config.ignoreComponents.map((ignoredComponent) => {
    components = components.filter(
      (item) => item.displayName != ignoredComponent,
    );
  });
  console.log("✅  Done");
  console.log("");

  console.log("📝️ Generating remote-react-component files");
  for (const component of components) {
    const remoteReactComponentFile =
      generateRemoteReactComponentFile(component);
    await jetpack.writeAsync(
      `packages/remote-react-components/src/${component.displayName}.ts`,
      await prepareTypeScriptOutput(remoteReactComponentFile),
    );
  }
  const remoteReactComponentsIndexFile =
    generateRemoteReactComponentIndexFile(components);
  await jetpack.writeAsync(
    "packages/remote-react-components/src/index.ts",
    await prepareTypeScriptOutput(remoteReactComponentsIndexFile),
  );
  console.log("✅  Done");
  console.log("");

  console.log("📝️ Generating remote-element files");
  for (const component of components) {
    const remoteElementFile = generateRemoteElementFile(component);
    await jetpack.writeAsync(
      `packages/remote-elements/src/${component.displayName}.ts`,
      await prepareTypeScriptOutput(remoteElementFile),
    );
  }
  await jetpack.writeAsync(
    "packages/remote-elements/src/index.ts",
    await prepareTypeScriptOutput(remoteReactComponentsIndexFile),
  );
  console.log("✅  Done");
  console.log("");
  console.log("✅  Generation finished successfully");
}

void generate();
