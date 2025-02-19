export default () => {
  const styles: Record<string, React.CSSProperties> = {
    rootContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      border: "1px solid rgba(206, 75, 255, 1)",
      borderRadius: "4px",
      padding: "10px",
    },
    headerContainer: {
      display: "grid",
      gridTemplateAreas: `
        'logo header header'
      `,
      gridTemplateColumns: "60px 1fr 1fr",
      gap: "10px",
    },
    layoutContainer: {
      display: "grid",
      gridTemplateAreas: `
        'primaryNav secondaryNav breadcrumb breadcrumb'
        'primaryNav secondaryNav pageTitle button'
        'primaryNav secondaryNav content content'
      `,
      gridTemplateColumns: "30px 60px 1fr",
      gridTemplateRows: "auto auto 1fr",
      gap: "10px",
    },
    logo: {
      gridArea: "logo",
      backgroundColor: "rgba(0, 84, 245, 0.02)",
      padding: "10px",
      border: "1px dashed rgba(0, 84, 245, 1)",
      borderRadius: "4px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    header: {
      gridArea: "header",
      backgroundColor: "rgba(0, 84, 245, 0.02)",
      padding: "10px",
      textAlign: "center",
      border: "1px dashed rgba(0, 84, 245, 1)",
      borderRadius: "4px",
    },
    primaryNav: {
      gridArea: "primaryNav",
      backgroundColor: "rgba(0, 84, 245, 0.02)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "38px 0px",
      border: "1px dashed rgba(0, 84, 245, 1)",
      borderRadius: "4px",
      writingMode: "vertical-rl",
      transform: "rotate(180deg)",
    },
    secondaryNav: {
      gridArea: "secondaryNav",
      backgroundColor: "rgba(0, 84, 245, 0.02)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "38px 0px",
      border: "1px dashed rgba(0, 84, 245, 1)",
      borderRadius: "4px",
      writingMode: "vertical-rl",
      transform: "rotate(180deg)",
    },
    breadcrumb: {
      gridArea: "breadcrumb",
      backgroundColor: "rgba(0, 84, 245, 0.02)",
      textAlign: "center",
      border: "1px dashed rgba(0, 84, 245, 1)",
      borderRadius: "4px",
    },
    pageTitle: {
      gridArea: "pageTitle",
      backgroundColor: "rgba(0, 84, 245, 0.02)",
      textAlign: "center",
      border: "1px dashed rgba(0, 84, 245, 1)",
      borderRadius: "4px",
    },
    button: {
      gridArea: "button",
      backgroundColor: "rgba(0, 84, 245, 0.02)",
      padding: "0px 5px",
      textAlign: "center",
      border: "1px dashed rgba(0, 84, 245, 1)",
      borderRadius: "4px",
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
    <div style={styles.rootContainer}>
      <div style={styles.headerContainer}>
        <div style={styles.logo}>
          <p style={styles.textStyle}>Logo</p>
        </div>
        <header style={styles.header}>
          <p style={styles.textStyle}>Header</p>
        </header>
      </div>
      <div style={styles.layoutContainer}>
        <nav style={styles.primaryNav}>
          <p style={styles.textStyle}>Primary Navigation</p>
        </nav>
        <nav style={styles.secondaryNav}>
          <p style={styles.textStyle}>
            Secondary Navigation
          </p>
        </nav>
        <div style={styles.breadcrumb}>
          <p style={styles.textStyle}>Breadcrumb</p>
        </div>
        <div style={styles.pageTitle}>
          <p style={styles.textStyle}>Page Title</p>
        </div>
        <div style={styles.button}>
          <p style={styles.textStyle}>Button</p>
        </div>
        <main style={styles.content}>
          <p style={styles.textStyle}>Content</p>
        </main>
      </div>
    </div>
  );
};
