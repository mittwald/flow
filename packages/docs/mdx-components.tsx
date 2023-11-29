import type { MDXComponents } from "mdx/types";
import LiveCodeEditor from "./src/components/LiveCodeEditor/LiveCodeEditor";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    LiveCodeEditor,
  };
}
