"use client";
import { getRemotePath, getSvelteRemotePath } from "@/app/_lib/navigation";
import { RemoteFrame } from "@/app/host/_components/RemoteFrame";
import {
  IntlProvider,
  Section,
  Tab,
  Tabs,
  TabTitle,
} from "@mittwald/flow-react-components";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Framework = "react" | "svelte";

export default function HostLayout() {
  const hostPath = usePathname();
  const [framework, setFramework] = useState<Framework>("react");

  return (
    <IntlProvider locale="en-US">
      <Section>
        {/*
         * The same demo, rendered from a React and from a Svelte remote app.
         *
         * Only the selected tab holds a frame. `Tabs` keeps both panels
         * mounted, and two live remotes both follow the host's pathname and
         * both report their own back — so they overwrite each other's
         * navigation and the host bounces between them. One at a time costs a
         * reconnect per switch and keeps the demo behaving like a real host,
         * which only ever talks to one extension.
         *
         * Only a few demos exist on the Svelte side; the Svelte app says so
         * itself for the rest, which keeps the switch available everywhere.
         */}
        <Tabs
          aria-label="Remote framework"
          selectedKey={framework}
          onSelectionChange={(key) => setFramework(key as Framework)}
        >
          <Tab id="react">
            <TabTitle>React</TabTitle>
            {framework === "react" && (
              <RemoteFrame
                src={getRemotePath(hostPath)}
                hostPathname={hostPath}
              />
            )}
          </Tab>
          <Tab id="svelte">
            <TabTitle>Svelte</TabTitle>
            {framework === "svelte" && (
              <RemoteFrame
                src={getSvelteRemotePath(hostPath)}
                hostPathname={hostPath}
              />
            )}
          </Tab>
        </Tabs>
      </Section>
    </IntlProvider>
  );
}
