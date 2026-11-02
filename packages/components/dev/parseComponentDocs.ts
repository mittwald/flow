import path from "path";
import * as docgen from "react-docgen-typescript";
import type { ComponentDoc } from "react-docgen-typescript";
import ts from "typescript";
import { withCallableReturns } from "./remote-components-generator/lib/callableReturn";

const parserOptions: docgen.ParserOptions = {
  skipChildrenPropWithoutDoc: false,
  shouldRemoveUndefinedFromOptional: true,
  shouldExtractLiteralValuesFromEnum: true,
  savePropValueAsString: true,
};

/*
 * `shouldExtractLiteralValuesFromEnum` resolves the members behind a literal
 * union alias (`gap?: GapSize`), which `typeToString` would print as the bare
 * alias name. It reports them as `{ name: "enum", value: [...] }` — fold them
 * back into the union string every consumer reads from `type.name`.
 */
function expandLiteralUnions(components: ComponentDoc[]): void {
  for (const component of components) {
    for (const prop of Object.values(component.props)) {
      const { name, value } = prop.type;
      if (name === "enum" && Array.isArray(value) && value.length > 0) {
        prop.type.name = value
          .map((member: { value: unknown }) => String(member.value))
          .join(" | ");
      }
    }
  }
}

/** The compiler options of a tsconfig, resolved the way docgen resolves them. */
export const compilerOptionsOf = (tsconfigPath: string): ts.CompilerOptions => {
  const { config, error } = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
  if (error) {
    throw new Error(ts.flattenDiagnosticMessageText(error.messageText, "\n"));
  }

  const { options, errors } = ts.parseJsonConfigFileContent(
    config,
    ts.sys,
    path.dirname(tsconfigPath),
    {},
    tsconfigPath,
  );
  const [firstError] = errors;
  if (firstError) {
    throw new Error(
      ts.flattenDiagnosticMessageText(firstError.messageText, "\n"),
    );
  }

  return options;
};

/**
 * Runs react-docgen-typescript over `files` of `program`, with each prop type
 * carrying `callableReturn` for the remote-components generator.
 */
export const parseComponentDocs = (
  program: ts.Program,
  files: string[],
): ComponentDoc[] => {
  const parser = docgen.withCompilerOptions(
    program.getCompilerOptions(),
    parserOptions,
  );

  const components = withCallableReturns(program.getTypeChecker(), () =>
    parser.parseWithProgramProvider(files, () => program),
  );
  expandLiteralUnions(components);
  return components;
};
