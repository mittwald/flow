import { getContext, setContext } from "svelte";

const navigateKey = Symbol.for("svelteDemoNavigation");

/** @param {(page: string) => void} navigate */
export const setDemoNavigation = (navigate) =>
  setContext(navigateKey, navigate);

/**
 * The Svelte app routes itself — see `DemoRoot.svelte`. The React demos use
 * Next's router for this; a second router in the loop is what breaks the host's
 * navigation, so the demos navigate through the app that owns the state.
 */
export const useDemoNavigation = () => {
  const navigate = getContext(navigateKey);

  if (!navigate) {
    throw new Error("useDemoNavigation() must be called inside the Svelte app");
  }

  return navigate;
};
