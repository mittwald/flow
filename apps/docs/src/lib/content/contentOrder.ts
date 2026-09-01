/**
 * The authored order of the documentation, as a flat list of pathnames in the
 * order they should appear. It replaces the numeric prefixes the content
 * directories used to carry, which the URLs no longer have.
 *
 * Two siblings sort by their position here. Anything not listed sorts after
 * everything listed, by label — deliberate for the components, which are
 * alphabetical. `contentOrder.test.ts` guards the state in between: a directory
 * lists all of its children or none of them, never some.
 */
export const CONTENT_ORDER: readonly string[] = [
  "/get-started",
  "/releases",
  "/foundations",
  "/foundations/design",
  "/foundations/design/design-tokens",
  "/foundations/design/colors",
  "/foundations/design/themes",
  "/foundations/design/accessibility",
  "/foundations/design/typography",
  "/foundations/structure",
  "/foundations/structure/layout",
  "/foundations/structure/spacing",
  "/foundations/structure/components",
  "/foundations/content-guidelines",
  "/foundations/content-guidelines/sprach-guide",
  "/foundations/content-guidelines/informationskonzept",
  "/foundations/content-guidelines/fehlermeldungen",
  "/patterns",
  "/patterns/patterns",
  "/patterns/codesnippets",
  "/templates",
  "/templates/seiten",
  "/templates/seiten/uebersichtsseite",
  "/templates/seiten/detailseite",
  "/templates/seiten/seite-mit-tab-navigation",
  "/templates/seiten/dashboard",
  "/templates/overlays",
  "/templates/overlays/formular-overlay",
  "/templates/overlays/bestaetigungs-overlay",
  "/templates/overlays/mehrstufiges-overlay",
  "/templates/bereiche",
  "/templates/bereiche/stammdaten-bereich",
  "/templates/bereiche/listen-bereich",
  "/templates/bereiche/alerts-bereich",
  "/templates/bausteine",
  "/templates/bausteine/formular",
  "/templates/bausteine/listeneintrag",
  "/templates/bausteine/leerzustand",
  "/templates/bausteine/aktionsmenue",
  "/templates/bausteine/dashboard-kachel",
  "/templates/bausteine/kopierbarer-wert",
  "/components",
];

const positions = new Map(CONTENT_ORDER.map((pathname, i) => [pathname, i]));

/** The authored position of a pathname, or `undefined` if it is not ordered. */
export const contentPosition = (pathname: string): number | undefined =>
  positions.get(pathname);

const segmentsOf = (pathname: string): string[] =>
  pathname.split("/").filter(Boolean);

/**
 * Order two pathnames the way the documentation is authored.
 *
 * Compares them at the level where they first diverge, so a page inherits the
 * position of the section it sits in: `/patterns/patterns/dashboard` precedes
 * `/patterns/codesnippets/multi-upload` because `/patterns/patterns` is listed
 * before `/patterns/codesnippets`. Returns 0 when neither side is ordered at
 * that level — chain a tie-breaker (a label, a filename) behind it.
 */
export const byContentOrder = (a: string, b: string): number => {
  const segmentsA = segmentsOf(a);
  const segmentsB = segmentsOf(b);

  for (let i = 0; i < Math.min(segmentsA.length, segmentsB.length); i++) {
    if (segmentsA[i] === segmentsB[i]) {
      continue;
    }

    const positionA = contentPosition(
      `/${segmentsA.slice(0, i + 1).join("/")}`,
    );
    const positionB = contentPosition(
      `/${segmentsB.slice(0, i + 1).join("/")}`,
    );

    return positionA !== undefined && positionB !== undefined
      ? positionA - positionB
      : 0;
  }

  return segmentsA.length - segmentsB.length;
};
