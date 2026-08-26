/** Format an ISO date as an English long date, e.g. "14 August 2026". */
export const formatReleaseDate = (iso: string): string =>
  iso
    ? new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(
        new Date(iso),
      )
    : "";
