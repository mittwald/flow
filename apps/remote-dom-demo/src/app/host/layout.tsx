"use client";
import { RemoteFrame } from "@/app/host/_components/RemoteFrame";
import { getRemotePath, getVueRemotePath } from "@/app/_lib/navigation";
import {
  IntlProvider,
  Section,
  Tab,
  Tabs,
  TabTitle,
} from "@mittwald/flow-react-components";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Framework = "react" | "vue";

/** `?framework=vue` selects the Vue remote; React is the default and unmarked. */
const frameworkParameter = "framework";

export default function HostLayout() {
  const hostPath = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [framework, setFramework] = useState<Framework>(() =>
    searchParams.get(frameworkParameter) === "vue" ? "vue" : "react",
  );

  /*
   * Mirrored into the URL, so a reload keeps the choice. The state stays the
   * source of truth, because every navigation drops the parameter — a
   * sidebar link, and the remote reporting its own path — and this puts it
   * back.
   */
  useEffect(() => {
    const expected = framework === "vue" ? "vue" : null;
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
         * The same demo, rendered from a React and from a Vue remote app.
         *
         * Only the selected tab holds a frame. `Tabs` keeps both panels
         * mounted, and two live remotes both follow the host's pathname and
         * both report their own back — so they overwrite each other's
         * navigation and the host bounces between them. One at a time costs a
         * reconnect per switch and keeps the demo behaving like a real host,
         * which only ever talks to one extension.
         *
         * All but three demos exist on the Vue side; for those three the Vue
         * app says so itself (`NotPortedDemo`), which keeps the switch
         * available everywhere.
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
        </Tabs>
      </Section>
    </IntlProvider>
  );
}
