/** Component pages compare without their sub page segment (e.g. `/overview`). */
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
