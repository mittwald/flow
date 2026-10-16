"use client";
import { RemoteFrame } from "@/app/host/_components/RemoteFrame";
import {
  getRemotePath,
  getSvelteRemotePath,
  getVueRemotePath,
} from "@/app/_lib/navigation";
import {
  IntlProvider,
  Section,
  Tab,
  Tabs,
  TabTitle,
} from "@mittwald/flow-react-components";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Framework = "react" | "vue" | "svelte";

/**
 * `?framework=vue` or `?framework=svelte` selects that remote; React is the
 * default and unmarked.
 */
const frameworkParameter = "framework";

const frameworkFromParameter = (value: string | null): Framework =>
  value === "vue" || value === "svelte" ? value : "react";

export default function HostLayout() {
  const hostPath = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [framework, setFramework] = useState<Framework>(() =>
    frameworkFromParameter(searchParams.get(frameworkParameter)),
  );

  /*
   * Mirrored into the URL, so a reload keeps the choice. The state stays the
   * source of truth, because every navigation drops the parameter — a
   * sidebar link, and the remote reporting its own path — and this puts it
   * back.
   */
  useEffect(() => {
    const expected = framework === "react" ? null : framework;
    if (searchParams.get(frameworkParameter) !== expected) {
      router.replace(
        expected ? `${hostPath}?${frameworkParameter}=${expected}` : hostPath,
      );
    }
  }, [framework, hostPath, router, searchParams]);

  return (
    <IntlProvider locale="en-US">
      <Section>
        {/*
         * The same demo, rendered from a React, a Vue and a Svelte remote app.
         *
         * Only the selected tab holds a frame. `Tabs` keeps every panel
         * mounted, and two live remotes both follow the host's pathname and
         * both report their own back — so they overwrite each other's
         * navigation and the host bounces between them. One at a time costs a
         * reconnect per switch and keeps the demo behaving like a real host,
         * which only ever talks to one extension.
         *
         * All but three demos exist on the Vue side; for those three the Vue
         * app says so itself (`NotPortedDemo`). Only a few demos exist on the
         * Svelte side; the Svelte app says so itself for the rest
         * (`NotPorted.svelte`). Both keep the switch available everywhere.
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
          <Tab id="vue">
            <TabTitle>Vue</TabTitle>
            {framework === "vue" && (
              <RemoteFrame
                src={getVueRemotePath(hostPath)}
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
