import { parseArgs } from "node:util";

export type Command = "upgrade" | "list" | "codemod" | "help" | "version";

export interface ParsedCommand {
  command: Command;
  /**
   * `upgrade` always has one (defaulted below when not given explicitly).
   * `list` has one only when given — that presence/absence is what
   * distinguishes "the whole catalogue" from "the range this revision would
   * touch". `patch` | `minor` | `major` | a dist-tag | an exact version.
   */
  revision?: string;
  /** `codemod` only. */
  id?: string;
  /** Sources to transform. Unset means "decide at run time". */
  path?: string;
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
    // No default here, unlike `upgrade`: `revision` unset is what makes a
    // bare `list` the catalogue browser rather than `list minor`.
    return { command: "list", revision: second, ...flags };
  }

  return {
    command: "codemod",
    id: first,
    path: second ?? values.path,
    ...flags,
  };
};
