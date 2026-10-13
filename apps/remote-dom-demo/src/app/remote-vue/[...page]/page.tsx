"use client";
import { VueRemoteApp } from "@/app/remote-vue/_components/VueRemoteApp";

/**
 * One route for every Vue demo. The React demos each get their own page under
 * `/remote`; the Vue ones are plain objects in a registry, and the Vue app
 * picks from it by pathname — so a single catch-all route serves them all.
 */
export default function Page() {
  return <VueRemoteApp />;
}
