import { IconMittwald } from "@mittwald/flow-react-components";

export default () => {
  const area: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "var(--size-px--xs)",
    backgroundColor:
      "var(--info-soft-background-color--default)",
    border: "1px dashed var(--info-soft-content-color)",
    borderRadius: "var(--corner-radius--s)",
  };

  const vertical: React.CSSProperties = {
    writingMode: "vertical-rl",
    transform: "rotate(180deg)",
  };

  const layout: React.CSSProperties = {
    alignSelf: "stretch",
    height: "280px",
    display: "grid",
    gridTemplateAreas: `
      'logo       header       header     header'
      'primaryNav secondaryNav breadcrumb breadcrumb'
      'primaryNav secondaryNav pageTitle  button'
      'primaryNav secondaryNav content    content'
    `,
    gridTemplateColumns: "1fr 2fr 12fr 3fr",
    gridTemplateRows: "auto auto auto 1fr",
    gap: "var(--size-px--s)",
    color: "var(--info-soft-content-color)",
    fontSize: "var(--font-size-text--s)",
  };

  return (
    <div style={layout}>
      <div style={{ ...area, gridArea: "logo" }}>
        <IconMittwald size="s" />
      </div>
      <header style={{ ...area, gridArea: "header" }}>
        Header
      </header>
      <nav
        style={{
          ...area,
          ...vertical,
          gridArea: "primaryNav",
        }}
      >
        Primary Navigation
      </nav>
      <nav
        style={{
          ...area,
          ...vertical,
          gridArea: "secondaryNav",
        }}
      >
        Secondary Navigation
      </nav>
      <div style={{ ...area, gridArea: "breadcrumb" }}>
        Breadcrumb
      </div>
      <div style={{ ...area, gridArea: "pageTitle" }}>
        Page Title
      </div>
      <div style={{ ...area, gridArea: "button" }}>
        Button
      </div>
      <main style={{ ...area, gridArea: "content" }}>
        Content
      </main>
    </div>
  );
};
