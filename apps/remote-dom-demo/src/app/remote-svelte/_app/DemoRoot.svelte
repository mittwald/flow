<script>
  import { RemoteRoot } from "@mittwald/flow-remote-svelte-components";
  import NotPorted from "../_demos/NotPorted.svelte";
  import { demos } from "./demos.js";
  import { setDemoNavigation } from "./navigation.js";

  const demoPageOf = (pathname) =>
    pathname.replace(/^\/(remote-svelte|host|remote)\/?/, "").replace(/\/$/, "");

  let page = $state(demoPageOf(location.pathname));

  /*
   * The host drives navigation (it tells the remote where it went, and the
   * remote reports back where it is). `history.replaceState` keeps the URL
   * honest for the watcher that reports it, without Next's router deciding what
   * to render — a second router is one frame behind what the app already
   * decided, and the two overwrite each other until the host snaps back.
   */
  const goTo = (nextPage) => {
    history.replaceState(null, "", `/remote-svelte/${nextPage}`);
    page = nextPage;
  };

  setDemoNavigation(goTo);

  const Demo = $derived(demos[page] ?? NotPorted);
</script>

<RemoteRoot onHostPathnameChanged={(hostPathname) => goTo(demoPageOf(hostPathname))}>
  <Demo />
</RemoteRoot>
