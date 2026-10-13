/* Only web URLs leave the page. Relative paths, anchors and schemes like
   `mailto:` stay in the current tab. */
export const isExternalHref = (href: string | undefined) =>
  !!href && /^(https?:|\/\/)/i.test(href);
