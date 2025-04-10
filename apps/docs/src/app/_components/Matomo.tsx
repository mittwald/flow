"use client";
import { type FC, useEffect } from "react";

export const Matomo: FC = () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const _mtm = (window._mtm = window._mtm || []);
    _mtm.push({ "mtm.startTime": new Date().getTime(), event: "mtm.Start" });
    const d = document,
      g = d.createElement("script"),
      s = d.getElementsByTagName("script")[0];
    g.async = true;
    g.src = "https://td.mittwald.de/js/container_s2HTtJKN.js";
    s?.parentNode?.insertBefore(g, s);
  }, []);

  return <></>;
};
