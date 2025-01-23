import type { PropsWithChildren } from "react";
import { LinkProvider } from "@mittwald/flow-react-components/nextjs";

export default function Layout(props: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <LinkProvider>{props.children}</LinkProvider>
      </body>
    </html>
  );
}
