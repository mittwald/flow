import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";

/**
 * Compiles a page's `deprecationNotice` frontmatter to MDX so the successor
 * component can be linked inline. Uses the same remark setup as the page
 * content, so a link in the notice renders like a link in the body.
 */
export const serializeDeprecationNotice = async (
  notice: string | undefined,
): Promise<MDXRemoteSerializeResult | undefined> =>
  notice === undefined
    ? undefined
    : serialize(notice, { mdxOptions: { remarkPlugins: [remarkGfm] } });
