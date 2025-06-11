"use client";
import "@mittwald/flow-react-components/all.css";
import { type PropsWithChildren } from "react";

export default function Layout(props: PropsWithChildren) {
  return (
    <html lang="en">
      <body>{props.children} </body>
    </html>
  );
}
