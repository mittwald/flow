"use client";
export const getRemotePath = (path: string) =>
  path.replace("/host/", "/remote/");
export const getHostPath = (path: string) => path.replace("/remote/", "/host/");
export const isNavigationExample = (path: string) =>
  path.includes("/navigation/");
