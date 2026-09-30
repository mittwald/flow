export type ContextMenuSelectionMode =
  "single" | "multiple" | "navigation" | "switch";

export const getAriaSelectionMode = (
  selectionMode?: ContextMenuSelectionMode,
) => {
  return selectionMode === "navigation"
    ? "none"
    : selectionMode === "switch"
      ? "multiple"
      : selectionMode;
};

export const getMenuItemSelectionVariant = (
  selectionMode?: ContextMenuSelectionMode,
) => {
  return selectionMode === "single" || selectionMode === "multiple"
    ? "control"
    : selectionMode;
};

/**
 * Whether selecting an item closes the menu. A mode that collects several
 * selections keeps it open.
 */
export const closesOnSelect = (selectionMode?: ContextMenuSelectionMode) => {
  return selectionMode !== "multiple" && selectionMode !== "switch";
};
