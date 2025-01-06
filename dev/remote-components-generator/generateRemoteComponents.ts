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
import type { RemoteComponentGeneratorConfig } from "./types/config";

const componentFileLoader = new ComponentFileLoader();
const componentFileContentLoader = new ComponentFileContentLoader(
  componentFileLoader,
);

async function generate() {
  const config: RemoteComponentGeneratorConfig = remoteComponentGeneratorConfig;

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

  console.log("💣 Remove ignored components and props");
  for (const [componentName, componentConfig] of Object.entries(
    config.components,
  )) {
    if (componentConfig.ignore) {
      console.log(` .. removing "${componentName}"`);
      components = components.filter(
        (item) => item.displayName != componentName,
      );
    }
    if (componentConfig.ignoreProps) {
      const component = components.find(
        (item) => item.displayName == componentName,
      );
      if (component?.props) {
        componentConfig.ignoreProps.map((ignoredProp) => {
          console.log(` .. removing ${componentName}'s "${ignoredProp}" prop`);
          delete component.props[ignoredProp];
        });
      }
    }
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
        `${dir}/${component.displayName}.ts`,
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
    const indexFile = generateRemoteReactComponentIndexFile(components);

    jetpack.remove(dir);

    for (const component of components) {
      const remoteElementFile = generateRemoteElementFile(component);
      await jetpack.writeAsync(
        `${dir}/${component.displayName}.ts`,
        await prepareTypeScriptOutput(remoteElementFile),
      );
    }
    await jetpack.writeAsync(
      `${dir}/index.ts`,
      await prepareTypeScriptOutput(indexFile),
    );
    console.log("✅  Done");
    console.log("");
    console.log("✅  Generation finished successfully");
  }
}

void generate();
