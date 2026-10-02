"use client";
import DemoRoot from "@/app/remote-svelte/_app/DemoRoot.svelte";
import { useEffect, useRef, type FC } from "react";
import { mount } from "svelte";

/**
 * Mounts a Svelte app inside the Next page that Next serves into the host's
 * iframe.
 *
 * React owns the page, Svelte owns everything below `<RemoteRoot />` — which is
 * the point of this demo: the host renders Flow components either way, and only
 * the framework producing the remote tree differs.
 */
export const SvelteRemoteApp: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    /*
     * Mounted once and never torn down. Each mount opens its own connection to
     * the parent frame, and in development React runs an effect twice — which
     * would announce two remote roots to one host. The page lives in an iframe
     * the host discards wholesale, so there is nothing to clean up.
     */
    if (!container || isMounted.current) {
      return;
    }
    isMounted.current = true;
    mount(DemoRoot, { target: container });
  }, []);

  return <div ref={containerRef} />;
};

export default SvelteRemoteApp;
