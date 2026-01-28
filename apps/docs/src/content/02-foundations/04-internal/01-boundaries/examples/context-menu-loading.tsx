import { SkeletonText } from "@mittwald/flow-react-components";

<div
  style={{
    width: "fit-content",
    rowGap: "var(--menu--item-to-item-spacing)",
    padding: "var(--popover--padding--s)",
    flexDirection: "column",
    display: "flex",
    backgroundColor: "var(--popover--background-color)",
    boxShadow: "var(--popover--box-shadow)",
    borderRadius: "var(--popover--corner-radius)",
    borderWidth: "var(--popover--border-width)",
    borderStyle: "var(--popover--border-style)",
    borderColor: "var(--popover--border-color)",
    minWidth: "var(--popover--min-width)",
  }}
>
  <div
    style={{
      padding:
        "var(--menu-item--padding-y) var(--menu-item--padding-x)",
    }}
  >
    <SkeletonText />
  </div>
  <div
    style={{
      padding:
        "var(--menu-item--padding-y) var(--menu-item--padding-x)",
    }}
  >
    <SkeletonText />
  </div>
  <div
    style={{
      padding:
        "var(--menu-item--padding-y) var(--menu-item--padding-x)",
    }}
  >
    <SkeletonText />
  </div>
</div>;
