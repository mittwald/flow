"use client";
import { RemoteRenderer } from "@mittwald/flow-remote-react-renderer/RemoteRenderer";
import { useParams } from "next/navigation";
import { useState } from "react";
import Switch from "@mittwald/flow-react-components/Switch";
import Label from "@mittwald/flow-react-components/Label";

export default function Page() {
  const { demo } = useParams<{ demo: string }>();
  const [iframeVisible, setIframeVisible] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        rowGap: "8px",
      }}
    >
      <Switch
        isSelected={iframeVisible}
        onChange={() => setIframeVisible((was) => !was)}
      >
        <Label>Remote Frame anzeigen</Label>
      </Switch>
      <div
        style={{
          padding: 16,
          border: "1px dotted grey",
          position: "relative",
        }}
      >
        <RemoteRenderer
          src={`http://localhost:3000/remote/${demo}`}
          iframeStyle={
            iframeVisible
              ? {
                  marginTop: 16,
                  border: "2px dashed red",
                  height: "33%",
                  width: "100%",
                }
              : {
                  border: 0,
                  bottom: 0,
                  left: -9999,
                  position: "absolute",
                  right: 0,
                  height: 0,
                  width: 0,
                }
          }
        />
      </div>
    </div>
  );
}
