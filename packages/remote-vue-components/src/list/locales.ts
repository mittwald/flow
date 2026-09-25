import { useLanguage } from "@/composables/remoteContext";
import { computed, type ComputedRef } from "vue";

/*
 * Copied from `packages/components/src/components/List/locales/*.locale.json`.
 *
 * Flow's strings are compiled into the React bundle by a locale plugin and are
 * not importable from a published package, so a Vue binding has to carry its
 * own — the same trade as `Modal`'s four confirm-close strings, at a larger
 * count. A rewording on the Flow side drifts here without failing anything.
 */
const texts = {
  "en-US": {
    dateRange: "Date range",
    filters: "Filters",
    "filters.all": "All filters",
    "filters.clear": "Clear filters",
    "filters.clearSelection": "Clear selection",
    "filters.reset": "Reset filters",
    "filters.store": "Store filters",
    loadingMore: "Loading more items",
    "noItems.heading": "No items available",
    "noItems.text":
      "Once there are items available, they will be displayed here.",
    "noResult.heading": "No search results found",
    "noResult.text":
      "Your search did not return any results. Please adjust the search query or your filters.",
    options: "Options",
    paginationInfo: "Showing {visibleItemsCount} of {totalItemsCount}",
    reset: "Reset",
    /*
     * One key per branch, because Flow's is ICU (`{n, select, 1 {…} other {…}}`)
     * and this binding carries a `{name}` formatter rather than an ICU parser.
     * The two branches are picked in code — see `AllFiltersModal`.
     */
    "results.show.one": "Show {totalItemCount} result",
    "results.show.other": "Show {totalItemCount} Results",
    settings: "Settings",
    "settings.viewMode": "View",
    "settings.viewMode.list": "List",
    "settings.viewMode.table": "Table",
    "settings.viewMode.tiles": "Tiles",
    showMore: "Show more",
    sorting: "Sorting",
    "toggleExpandButton.collapse": "Show less",
    "toggleExpandButton.expand": "Show more",
  },
  "de-DE": {
    dateRange: "Zeitraum",
    filters: "Filter",
    "filters.all": "Alle Filter",
    "filters.clear": "Filter entfernen",
    "filters.clearSelection": "Auswahl aufheben",
    "filters.reset": "Filter zurücksetzen",
    "filters.store": "Filter speichern",
    loadingMore: "Weitere Einträge werden geladen",
    "noItems.heading": "Keine Einträge vorhanden",
    "noItems.text":
      "Sobald Einträge vorhanden sind, werden sie hier angezeigt.",
    "noResult.heading": "Keine Suchergebnisse gefunden",
    "noResult.text":
      "Deine Suche ergab keine Ergebnisse. Bitte passe die Suchanfrage oder deine Filter an.",
    options: "Optionen",
    paginationInfo:
      "{visibleItemsCount} von insgesamt {totalItemsCount} angezeigt",
    reset: "Zurücksetzen",
    "results.show.one": "{totalItemCount} Ergebnis anzeigen",
    "results.show.other": "{totalItemCount} Ergebnisse anzeigen",
    settings: "Einstellungen",
    "settings.viewMode": "Ansicht",
    "settings.viewMode.list": "Liste",
    "settings.viewMode.table": "Tabelle",
    "settings.viewMode.tiles": "Raster",
    showMore: "Mehr anzeigen",
    sorting: "Sortierung",
    "toggleExpandButton.collapse": "Weniger anzeigen",
    "toggleExpandButton.expand": "Mehr anzeigen",
  },
} as const;

export type ListTextKey = keyof (typeof texts)["en-US"];

export type ListTextFormatter = (
  key: ListTextKey,
  values?: Record<string, string | number>,
) => string;

/**
 * The list's texts in the host's language.
 *
 * Only `{name}` placeholders, not ICU: the two strings that interpolate count
 * items, and neither pluralizes. A string that needed a plural rule would need
 * a formatter, and the honest fix then is `@flr-generate` on the List rather
 * than an ICU parser in a binding.
 */
export const useListTexts = (): ComputedRef<ListTextFormatter> => {
  const language = useLanguage();

  return computed(() => {
    const table = language.value?.startsWith("de")
      ? texts["de-DE"]
      : texts["en-US"];

    return (key, values = {}) =>
      table[key].replace(/\{(\w+)\}/g, (placeholder, name: string) =>
        name in values ? String(values[name]) : placeholder,
      );
  });
};
