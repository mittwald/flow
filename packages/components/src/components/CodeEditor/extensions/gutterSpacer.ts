import { GutterMarker, gutter } from "@uiw/react-codemirror";

class EmptyGutterSpacer extends GutterMarker {
  override toDOM() {
    const element = document.createElement("div");
    element.style.minWidth = "var(--form-control--spacing-x)";

    return element;
  }
}

export const gutterSpacer = () =>
  gutter({
    class: "cm-foldGutter-spacer",
    renderEmptyElements: true,
    initialSpacer: () => new EmptyGutterSpacer(),
  });
