/* Only web URLs with a host leave the page. Relative paths, anchors, schemes
   like `mailto:` and `https:foo` (resolved against the current page) stay in
   the current tab. */
export const isExternalHref = (href: string | undefined) =>
  !!href && /^(https?:)?\/\//i.test(href);
