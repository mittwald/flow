"use client";
import { type FC, useEffect } from "react";
import { isArray } from "remeda";

export const Matomo: FC = () => {
  useEffect(() => {
    const _paq = (
      "_paq" in window && isArray(window._paq) ? window._paq : []
    ) as unknown[];
    /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
    _paq.push(["trackPageView"]);
    _paq.push(["enableLinkTracking"]);
    (function () {
      const u = "//td.mittwald.de/";
      _paq.push(["setTrackerUrl", u + "matomo.php"]);
      _paq.push(["setSiteId", "2"]);
      const d = document,
        g = d.createElement("script"),
        s = d.getElementsByTagName("script")[0];
      g.async = true;
      g.src = u + "matomo.js";
      s?.parentNode?.insertBefore(g, s);
    })();

    const _mtm = (
      "_mtm" in window && isArray(window._mtm) ? window._mtm : []
    ) as unknown[];
    _mtm.push({ "mtm.startTime": new Date().getTime(), event: "mtm.Start" });
    (function () {
      const d = document,
        g = d.createElement("script"),
        s = d.getElementsByTagName("script")[0];
      g.async = true;
      g.src = "https://td.mittwald.de/js/container_72wp3khC.js";
      s?.parentNode?.insertBefore(g, s);
    })();
  }, []);
  return <></>;
};
