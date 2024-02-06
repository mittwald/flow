import type { MDXComponents } from "mdx/types";
import Heading from "@mittwald/flow-react-components/Heading";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: ({ children }) => <Heading level={1}>{children}</Heading>,
    h2: ({ children }) => <Heading level={2}>{children}</Heading>,
    h3: ({ children }) => <Heading level={3}>{children}</Heading>,
    h4: ({ children }) => <Heading level={4}>{children}</Heading>,
    h5: ({ children }) => <Heading level={5}>{children}</Heading>,
    h6: ({ children }) => <Heading level={6}>{children}</Heading>,
  };
}
