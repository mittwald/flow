"use client";
import { getVueRemotePath } from "@/app/_lib/navigation";
import { NotPortedDemo } from "@/app/remote-vue/_demos/notPorted";
import { vueDemos } from "@/app/remote-vue/_demos";
import { provideDemoNavigation } from "@/app/remote-vue/_demos/lib/navigation";
import { RemoteRoot } from "@mittwald/flow-remote-vue-components";
import { useEffect, useRef, type FC } from "react";
import { createApp, defineComponent, h, ref, type App } from "vue";

const demoPageOf = (pathname: string) =>
  pathname.replace(/^\/remote-vue\/?/, "").replace(/\/$/, "");

/**
 * Mounts a Vue app inside the Next page that Next serves into the host's
 * iframe.
 *
 * React owns the page, Vue owns everything below `<RemoteRoot />` — which is
 * the point of this demo: the host renders Flow components either way, and only
 * the framework producing the remote tree differs.
 *
 * The Vue app also does its own routing. The host drives navigation (it tells
 * the remote where it went, and the remote reports back where it is), and
 * putting Next's router in that loop adds a second one: Next re-renders this
 * component, which is one frame behind what the app already decided, and the
 * two overwrite each other until the host snaps back to the previous demo. A
 * `ref` plus `history.replaceState` keeps the URL honest for the watcher that
 * reports it, without a second router deciding what to render.
 */
export const VueRemoteApp: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<App>(undefined);

  useEffect(() => {
    const container = containerRef.current;
    /*
     * Mounted once and never torn down. Each mount opens its own connection to
     * the parent frame, and in development React runs an effect twice — which
     * would announce two remote roots to one host. The page lives in an iframe
     * the host discards wholesale, so there is nothing to clean up.
     */
    if (!container || appRef.current) {
      return;
    }

    const page = ref(demoPageOf(location.pathname));

    const goTo = (nextPage: string) => {
      history.replaceState(null, "", `/remote-vue/${nextPage}`);
      page.value = nextPage;
    };

    /*
     * The demos reach navigation through `provide`, so it has to come from a
     * component rather than the app's root render function.
     */
    const Demos = defineComponent({
      name: "Demos",
      setup() {
        provideDemoNavigation(goTo);
        return () => h(vueDemos[page.value] ?? NotPortedDemo);
      },
    });

    const app = createApp({
      render: () =>
        h(
          RemoteRoot,
          {
            onHostPathnameChanged: (hostPathname: string) =>
              goTo(demoPageOf(getVueRemotePath(hostPathname))),
          },
          { default: () => h(Demos) },
        ),
    });
    appRef.current = app;
    app.mount(container);
  }, []);

  return <div ref={containerRef} />;
};

export default VueRemoteApp;
