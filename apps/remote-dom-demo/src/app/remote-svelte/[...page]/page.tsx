"use client";
import { SvelteRemoteApp } from "@/app/remote-svelte/_components/SvelteRemoteApp";

/**
 * One route for every Svelte demo. The React demos each get their own page
 * under `/remote`; the Svelte ones are components in a registry, and the Svelte
 * app picks from it by pathname — so a single catch-all route serves them all.
 */
export default function Page() {
  return <SvelteRemoteApp />;
}
