import type { MDXComponents } from "mdx/types";
import LiveCodeEditor from "@/components/LiveCodeEditor/LiveCodeEditor";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    LiveCodeEditor,
  };
}
