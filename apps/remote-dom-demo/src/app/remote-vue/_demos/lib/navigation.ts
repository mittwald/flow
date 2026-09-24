import { inject, provide, type InjectionKey } from "vue";

/** Navigates the Vue remote app to another demo page. */
export type NavigateToDemo = (page: string) => void;

const navigateKey: InjectionKey<NavigateToDemo> = Symbol("vueDemoNavigation");

export const provideDemoNavigation = (navigate: NavigateToDemo): void =>
  provide(navigateKey, navigate);

/**
 * The Vue app routes itself — see `VueRemoteApp`. The React demos use Next's
 * router for this; putting a second router in the loop is what broke the host's
 * navigation, so the demos navigate through the app that owns the state.
 */
export const useDemoNavigation = (): NavigateToDemo => {
  const navigate = inject(navigateKey, undefined);

  if (!navigate) {
    throw new Error("useDemoNavigation() must be called inside the Vue app");
  }

  return navigate;
};
