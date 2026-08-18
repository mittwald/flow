/**
 * Component pages have a sub page as their last path segment (e.g.
 * `/overview`), so the current pathname is compared without it.
 */
export const isActiveDocsPage = (
  pathname: string,
  currentPathname: string,
): boolean => {
  const isComponent = pathname.includes("04-components");
  const currentPage = isComponent
    ? currentPathname.substring(0, currentPathname.lastIndexOf("/"))
    : currentPathname;

  return pathname === currentPage;
};
