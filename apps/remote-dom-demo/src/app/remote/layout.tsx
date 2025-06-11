"use client";
import { getRemotePath } from "@/app/_lib/navigation";
import { NotificationProvider } from "@mittwald/flow-react-components";
import RemoteRoot from "@mittwald/flow-remote-react-components/RemoteRoot";
import { useRouter } from "next/navigation";
import { type PropsWithChildren } from "react";
import "./layout.css"; // Import global styles

export default function RemoteLayout(props: PropsWithChildren) {
  const router = useRouter();
  return (
    <RemoteRoot
      onHostPathnameChanged={(pathname) => {
        router.replace(getRemotePath(pathname));
      }}
    >
      <NotificationProvider>{props.children}</NotificationProvider>
    </RemoteRoot>
  );
}
