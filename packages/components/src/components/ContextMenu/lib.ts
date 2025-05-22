export type ContextMenuSelectionMode =
  | "single"
  | "multiple"
  | "navigation"
  | "switch";

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

export const getCloseOverlayType = (
  selectionMode?: ContextMenuSelectionMode,
) => {
  return selectionMode === "multiple" || selectionMode === "switch"
    ? undefined
    : "ContextMenu";
};
