import { MarkdownEditor } from "@mittwald/flow-react-components";

<MarkdownEditor
  aria-label="Nachricht"
  accept="image/*"
  placeholder="Ziehe einen Screenshot in das Eingabefeld ..."
  uploadFile={async () => {
    // Your application uploads the file it is called with and returns its URL.
    await new Promise((resolve) =>
      setTimeout(resolve, 1500),
    );
    return {
      url: "https://flow.mittwald.de/assets/mittwald_logo_rgb.jpg",
    };
  }}
/>;
