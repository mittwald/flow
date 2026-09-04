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
  formatObsoleteBaselineReport,
  formatUnserializablePropReport,
  obsoleteBaselineEntries,
  rejectedProps,
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
   * Thrown, not reported: apart from the acknowledged value-returning baseline
   * the list is empty, so the only way it grows is a new prop that would drop
   * whole mutation batches — or silently hand the host a Promise — at runtime.
   * Failing generation is the cheapest place to learn that; the alternative is
   * an extension developer whose page renders nothing, or `[object Promise]`.
   */
  const unserializableProps = checkSerializableProps(components);

  const rejected = rejectedProps(unserializableProps);
  if (rejected.length > 0) {
    throw new Error(formatUnserializablePropReport(rejected));
  }

  const obsolete = obsoleteBaselineEntries(unserializableProps);
  if (obsolete.length > 0) {
    throw new Error(formatObsoleteBaselineReport(obsolete));
  }

  const acknowledged = unserializableProps.length - rejected.length;
  if (acknowledged > 0) {
    console.log(
      `ℹ️  ${acknowledged} remote propert${acknowledged === 1 ? "y" : "ies"} return a value the host receives as a Promise (acknowledgedValueReturningProps in checkSerializableProps.ts)`,
    );
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
