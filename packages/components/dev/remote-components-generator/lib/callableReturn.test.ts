import path from "path";
import ts from "typescript";
import { beforeAll, describe, expect, test } from "vitest";
import type { ComponentDoc } from "react-docgen-typescript";
import {
  compilerOptionsOf,
  parseComponentDocs,
} from "../../parseComponentDocs";
import { checkSerializableProps } from "./checkSerializableProps";

const packageRoot = path.resolve(__dirname, "../../..");

/*
 * The fixture lives inside the package, so `react` and `react-markdown`
 * resolve from its `node_modules` exactly as they do for the real components.
 * It exists only in memory.
 */
const fixtureFile = path.join(packageRoot, "src/__fixture__/Fixture.tsx");

const fixture = `
import type { ComponentType, FC, ReactNode } from "react";
import type { Options } from "react-markdown";

type Formatter = (text: string, index: number) => string;
type AsyncFormatter = (text: string) => Promise<string> | string;
type Renderer = (item: string) => ReactNode;
type Listener = (value: string) => void;
type Predicate = (value: string) => boolean | null | undefined;
type Formatters = Formatter[];
type FormatterTuple = [formatter: Formatter, ...options: unknown[]];
interface WithMethod {
  format(value: string): string;
}

export interface FixtureProps {
  formatter?: Formatter;
  asyncFormatter?: AsyncFormatter;
  valueOrPromise?: (text: string) => string | Promise<string>;
  throws?: () => never;
  inlineFormatter?: (value: string) => string;
  renderItem?: Renderer;
  linkComponent?: ComponentType<{ href?: string }>;
  listener?: Listener;
  shouldClose?: boolean | (() => boolean);
  predicate?: Predicate;
  formatters?: Formatters;
  formatterTuple?: FormatterTuple;
  allowElement?: Options["allowElement"];
  urlTransform?: Options["urlTransform"];
  rehypePlugins?: Options["rehypePlugins"];
  formAction?: string | ((formData: FormData) => void | Promise<void>);
  withMethod?: WithMethod;
  label?: string;
  sizes?: number[];
  icon?: ReactNode;
  children?: ReactNode;
}

/** @flr-generate all */
export const Fixture: FC<FixtureProps> = () => null;
`;

const parseFixture = () => {
  const options = compilerOptionsOf(path.join(packageRoot, "tsconfig.json"));
  const host = ts.createCompilerHost(options);
  const { fileExists, getSourceFile, readFile } = host;

  host.fileExists = (file) => file === fixtureFile || fileExists(file);
  host.readFile = (file) => (file === fixtureFile ? fixture : readFile(file));
  host.getSourceFile = (file, languageVersion, ...rest) =>
    file === fixtureFile
      ? ts.createSourceFile(file, fixture, languageVersion, true)
      : getSourceFile(file, languageVersion, ...rest);

  const program = ts.createProgram([fixtureFile], options, host);
  return parseComponentDocs(program, [fixtureFile]);
};

/*
 * The props a remote host cannot use, spelled the way they are in the
 * components: behind a type alias, as a component type, or as a list. The
 * printed type name of each is just the alias, so nothing in it says
 * "function".
 */
describe("checkSerializableProps on parsed components", () => {
  let components: ComponentDoc[] = [];

  beforeAll(() => {
    components = parseFixture();
  }, 60_000);

  test("parses the fixture", () => {
    expect(components.map((c) => c.displayName)).toStrictEqual(["Fixture"]);
  });

  test("resolves aliases, component types and lists of functions", () => {
    const reports = checkSerializableProps(components).map(
      ({ prop, reason }) => `${prop}: ${reason}`,
    );

    expect(reports.sort()).toStrictEqual(
      [
        "allowElement: returns-a-value",
        "formatter: returns-a-value",
        "formatterTuple: returns-a-value",
        "formatters: returns-a-value",
        "inlineFormatter: returns-a-value",
        "linkComponent: returns-rendered-output",
        "predicate: returns-a-value",
        "rehypePlugins: returns-a-value",
        "renderItem: returns-rendered-output",
        "shouldClose: returns-a-value",
        "urlTransform: returns-a-value",
      ].sort(),
    );
  });

  /*
   * Spelled out for the record: an awaited return (`Promise<T> | T`), a return
   * nobody reads, plain data, slots — and an object whose methods are not
   * looked into, which is where the check stops.
   */
  test("stays quiet about the props a host can use", () => {
    const reported = new Set(
      checkSerializableProps(components).map(({ prop }) => prop),
    );

    for (const prop of [
      "asyncFormatter",
      "valueOrPromise",
      "throws",
      "listener",
      "formAction",
      "withMethod",
      "label",
      "sizes",
      "icon",
    ]) {
      expect(reported.has(prop), prop).toBe(false);
    }
  });
});
