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
import { checkTagIsSet, checkTagListIncludes } from "./lib/docTags";
import {
  checkSerializableProps,
  formatUnserializablePropReport,
} from "./lib/checkSerializableProps";
import type { ComponentDoc } from "react-docgen-typescript";
import { remoteComponentNameOf } from "./lib/remoteComponentNameOf";
import { generateRemoteReactRendererComponentsFile } from "./generation/generateRemoteReactRendererComponentsFile";
import { remoteComponentBaseNameOf } from "./lib/remoteComponentBaseNameOf";
import { sortBy } from "remeda";
import {
  generateViewComponent,
  generateViewComponentDeclaration,
} from "./generation/generateViewComponent";
import path from "path";

const jetpack = jp.dir("../..");

async function generate() {
  console.log("🤓 Read component specification file");
  let components: ComponentDoc[] =
    (await jetpack.readAsync(
      "packages/components/dist/assets/doc-properties.json",
      "json",
    )) ?? [];

  console.log("✅  Done");
  console.log("");

  console.log("🧐 Parse component specification file");

  components = sortBy(
    components.filter((c) => checkTagIsSet(c.tags, "generate")),
    (c) => remoteComponentBaseNameOf(c),
  );

  console.log("✅  Done");
  console.log("");

  console.log("🛠 Applying config");
  for (const ignoredProp of config.ignoreProps) {
    console.log(` ... removing "${ignoredProp}" prop`);
    components.forEach((c) => {
      delete c.props[ignoredProp];
    });
  }

  components.forEach((c) => {
    Object.keys(c.props).forEach((prop) => {
      if (checkTagListIncludes(c.tags, "ignore-props", prop)) {
        console.log(` ... removing "${prop}" prop from ${c.displayName}`);
        delete c.props[prop];
      }
    });
  });

  console.log("✅  Done");
  console.log("");

  /*
   * Reported rather than thrown: the offenders below predate the check, and
   * failing the build here would block every unrelated change until they are
   * designed away. Once the list is empty this should throw, so a new one cannot
   * ship — see the comment in lib/checkSerializableProps.ts.
   */
  const unserializableProps = checkSerializableProps(components);
  if (unserializableProps.length > 0) {
    console.log(formatUnserializablePropReport(unserializableProps));
    console.log("");
  }

  {
    console.log("📝️ Generating remote-react-component files");

    const dir = `packages/remote-react-components/src/auto-generated`;
    jetpack.remove(dir);

    for (const component of components) {
      const remoteReactComponentFile =
        generateRemoteReactComponentFile(component);

      const fullFilePath = `${dir}/${remoteComponentBaseNameOf(component)}.ts`;
      console.log(" - " + fullFilePath);

      await jetpack.writeAsync(
        fullFilePath,
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

      const fullFilePath = `${dir}/${remoteComponentNameOf(component)}.ts`;
      console.log(" - " + fullFilePath);

      await jetpack.writeAsync(
        fullFilePath,
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
    console.log("");
  }

  {
    console.log("📝️ Generating view component declaration files");

    for (const component of components) {
      const content = generateViewComponentDeclaration(component);
      const filePath = path.dirname(component.filePath);
      const componentsPackagePath = filePath.startsWith("/")
        ? ""
        : "packages/components/";

      const fullFilePath = `${componentsPackagePath}${filePath}/view.ts`;
      console.log(" - " + fullFilePath);
      await jetpack.writeAsync(
        fullFilePath,
        await prepareTypeScriptOutput(content),
      );
    }

    console.log("✅  Done");
    console.log("");

    console.log("📝️ Generating view components");

    const dir = `packages/components/src/views`;
    jetpack.remove(dir);

    for (const component of components) {
      const viewFilename = remoteComponentBaseNameOf(component);
      const content = generateViewComponent(component);

      const fullFilePath = `${dir}/${viewFilename}View.tsx`;
      console.log(" - " + fullFilePath);

      await jetpack.writeAsync(
        fullFilePath,
        await prepareTypeScriptOutput(content),
      );
    }

    console.log("✅  Done");
    console.log("");
  }

  console.log("✅  Generation finished successfully");
}

void generate();
