import { parseArgs } from "node:util";

export type Command = "upgrade" | "list" | "codemod" | "help" | "version";

export interface ParsedCommand {
  command: Command;
  /**
   * `upgrade` only. `patch` | `minor` | `major` | a dist-tag | an exact
   * version.
   */
  revision?: string;
  /** `codemod` only. */
  id?: string;
  /** Sources to transform. Unset means "decide at run time". */
  path?: string;
  /** `list` only. Both bounds are optional. */
  from?: string;
  to?: string;
  json: boolean;
  yes: boolean;
  dry: boolean;
  print: boolean;
  allowDirty: boolean;
}

/**
 * The default revision. `minor` stays inside the current major, so the command
 * never crosses a breaking boundary without being asked to.
 */
const defaultRevision = "minor";

export const parseArguments = (argv: string[]): ParsedCommand => {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    strict: true,
    options: {
      help: { type: "boolean", short: "h" },
      version: { type: "boolean", short: "V" },
      yes: { type: "boolean", short: "y" },
      json: { type: "boolean" },
      dry: { type: "boolean" },
      print: { type: "boolean" },
      "allow-dirty": { type: "boolean" },
      from: { type: "string" },
      to: { type: "string" },
      path: { type: "string" },
    },
  });

  const flags = {
    json: values.json === true,
    yes: values.yes === true,
    dry: values.dry === true,
    print: values.print === true,
    allowDirty: values["allow-dirty"] === true,
  };

  const [first, second] = positionals;

  if (values.version === true) {
    return { command: "version", ...flags };
  }
  if (values.help === true || first === undefined) {
    return { command: "help", ...flags };
  }
  if (first === "upgrade") {
    return {
      command: "upgrade",
      revision: second ?? defaultRevision,
      path: values.path,
      ...flags,
    };
  }
  if (first === "list") {
    return { command: "list", from: values.from, to: values.to, ...flags };
  }

  return {
    command: "codemod",
    id: first,
    path: second ?? values.path,
    ...flags,
  };
};
