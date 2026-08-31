import { AlertText } from "@mittwald/flow-react-components";

<div
  style={{
    width: "fit-content",
    padding: "var(--popover--padding--s)",
    backgroundColor: "var(--popover--background-color)",
    boxShadow: "var(--popover--box-shadow)",
    borderRadius: "var(--popover--corner-radius)",
    borderWidth: "var(--popover--border-width)",
    borderStyle: "var(--popover--border-style)",
    borderColor: "var(--popover--border-color)",
  }}
>
  <div
    style={{
      padding:
        "var(--menu-item--padding-y) var(--menu-item--padding-x)",
    }}
  >
    <AlertText status="danger">Fehler beim Laden</AlertText>
  </div>
</div>;
