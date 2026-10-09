"use client";
export const getRemotePath = (path: string) =>
  path.replace("/host/", "/remote/");
/** The Vue remote app serving the same demo — see `remote-vue/_demos`. */
export const getVueRemotePath = (path: string) =>
  path.replace("/host/", "/remote-vue/");
export const getHostPath = (path: string) =>
  path.replace("/remote-vue/", "/host/").replace("/remote/", "/host/");
export const isNavigationExample = (path: string) =>
  path.includes("/navigation/");
