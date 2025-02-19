import * as acorn from "acorn";
import tsPlugin from "acorn-typescript";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const tsxParser = acorn.Parser.extend(tsPlugin() as any);
