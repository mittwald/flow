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
      'header header'
      'nav    content'
    `,
    gridTemplateColumns: "1fr 5fr",
    gridTemplateRows: "1fr 6fr",
    gap: "var(--size-px--s)",
    color: "var(--info-soft-content-color)",
    fontSize: "var(--font-size-text--s)",
  };

  return (
    <div style={layout}>
      <header style={{ ...area, gridArea: "header" }}>
        Header
      </header>
      <nav
        style={{ ...area, ...vertical, gridArea: "nav" }}
      >
        Side-Navigation
      </nav>
      <main style={{ ...area, gridArea: "content" }}>
        Content
      </main>
    </div>
  );
};
