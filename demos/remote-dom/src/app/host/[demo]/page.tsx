"use client";
import { RemoteRenderer } from "@mittwald/flow-remote-react-renderer";
import { useParams } from "next/navigation";

export default function Page() {
  const { demo } = useParams<{ demo: string }>();
  return (
    <RemoteRenderer
      src={`http://localhost:3000/remote/${demo}`}
      iframeStyle={{
        border: 0,
        bottom: 0,
        left: 0,
        right: 0,
        height: "50%",
        minHeight: "300px",
        position: "fixed",
        width: "100%",
        boxSizing: "border-box",
        paddingInline: "10%",
      }}
    />
  );
}
