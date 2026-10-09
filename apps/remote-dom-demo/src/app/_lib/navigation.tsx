"use client";
export const getRemotePath = (path: string) =>
  path.replace("/host/", "/remote/");
/** The Svelte remote app serving the same demo — see `remote-svelte/_demos`. */
export const getSvelteRemotePath = (path: string) =>
  path.replace("/host/", "/remote-svelte/");
export const getHostPath = (path: string) =>
  path.replace("/remote-svelte/", "/host/").replace("/remote/", "/host/");
export const isNavigationExample = (path: string) =>
  path.includes("/navigation/");
