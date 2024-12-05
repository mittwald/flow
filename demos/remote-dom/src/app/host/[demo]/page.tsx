"use client";
import { RemoteRenderer } from "@mittwald/flow-remote-react-renderer";
import { useParams } from "next/navigation";

export default function Page() {
  const { demo } = useParams<{ demo: string }>();
  return <RemoteRenderer src={`http://localhost:3000/remote/${demo}`} />;
}
