import { ExtBridgeError } from "@/error";

const isBrowser: boolean =
  typeof window !== "undefined" && typeof window.document !== "undefined";

export const assertBrowserEnv = () => {
  if (!isBrowser) {
    throw new ExtBridgeError(
      "Ext Bridge can only be used in a browser environment. To opt-out from SSR you can use <BrowserOnly> from '@mittwald/flow-remote-react-components'.",
    );
  }
};
