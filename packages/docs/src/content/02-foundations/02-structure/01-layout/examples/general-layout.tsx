export default () => {
  const styles: Record<string, React.CSSProperties> = {
    layoutContainer: {
      display: "grid",
      gridTemplateAreas: `
        'header header'
        'nav content'
      `,
      gridTemplateColumns: "90px 1fr",
      gridTemplateRows: "auto 1fr",
      gap: "10px",
      border: "1px solid rgba(206, 75, 255, 1)",
      borderRadius: "4px",
      padding: "10px",
    },
    header: {
      gridArea: "header",
      backgroundColor: "rgba(0, 84, 245, 0.02)",
      padding: "10px",
      textAlign: "center",
      border: "1px dashed rgba(0, 84, 245, 1)",
      borderRadius: "4px",
    },
    sideNavigation: {
      gridArea: "nav",
      backgroundColor: "rgba(0, 84, 245, 0.02)",
      display: "flex",
      justifyContent: "center",
      padding: "55px 10px",
      border: "1px dashed rgba(0, 84, 245, 1)",
      borderRadius: "4px",
      width: "90px",
    },
    verticalText: {
      writingMode: "vertical-rl",
      transform: "rotate(180deg)",
    },
    content: {
      gridArea: "content",
      backgroundColor: "rgba(0, 84, 245, 0.02)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "10px",
      border: "1px dashed rgba(0, 84, 245, 1)",
      borderRadius: "4px",
    },
    textStyle: {
      color: "rgba(0, 63, 184, 1)",
      fontWeight: "400",
      fontSize: "14px",
    },
  };

  return (
    <div style={styles.layoutContainer}>
      <header style={styles.header}>
        <p style={styles.textStyle}>Header</p>
      </header>
      <nav style={styles.sideNavigation}>
        <p
          style={{
            ...styles.verticalText,
            ...styles.textStyle,
          }}
        >
          Side-Navigation
        </p>
      </nav>
      <main style={styles.content}>
        <p style={styles.textStyle}>Content</p>
      </main>
    </div>
  );
};
