import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";

/**
 * Compiles a page's `deprecationNotice` frontmatter to MDX so the successor
 * component can be linked inline. Uses the same remark setup as the page
 * content, so a link in the notice renders like a link in the body.
 *
 * A blank notice resolves to `undefined`, not to empty MDX:
 * `deprecationNotice:` with nothing behind it is YAML `null`, and an empty
 * string would render an empty callout body instead of falling back to the
 * generic sentence.
 */
export const serializeDeprecationNotice = async (
  notice: string | undefined,
): Promise<MDXRemoteSerializeResult | undefined> =>
  notice?.trim()
    ? serialize(notice, { mdxOptions: { remarkPlugins: [remarkGfm] } })
    : undefined;
