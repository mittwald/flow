import "@mittwald/flow-next-stylesheet";
import type { Metadata } from "next";
import "./styles.css";
import React, { FC, PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Flow – mittwald Design System",
};

const RootLayout: FC<PropsWithChildren> = (props) => {
  return (
    <html lang="en">
      <body className="flow">{props.children}</body>
    </html>
  );
};

export default RootLayout;
