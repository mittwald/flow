import {
  type FC,
  useLayoutEffect,
  useReducer,
  useRef,
  useSyncExternalStore,
} from "react";
import { useTunnelState } from "@/context";
import { observer } from "mobx-react-lite";
import type { TunnelChildren } from "@/TunnelState";
export type TunnelExitChildren = TunnelChildren;

export interface TunnelExitProps {
  id?: string;
  /** Select a dedicated tunnel provider by ID. */
  providerId?: string;
  children?: TunnelExitChildren;
}

const ChildrenRenderer: FC<{ children: TunnelExitChildren }> = (props) => {
  const { children } = props;
  return typeof children === "function" ? children() : children;
};

export const TunnelExit: FC<TunnelExitProps> = observer((props) => {
  const { children, id, providerId } = props;
  const isSsr = useSyncExternalStore(
    () => () => null,
    () => false,
    () => true,
  );

  /**
   * Render-phase children bridge the gap until the entries have committed: on
   * the server render, and on the exit's first client render, where a
   * client-only mount has no committed children yet. Without the client half of
   * that bridge the tunnelled content is missing from the first commit — long
   * enough for react-aria's `useSlot` to conclude a tunnelled `<Label>` does
   * not exist and to warn about a missing accessible name.
   *
   * The flag is flipped in a layout effect, never during render, so repeated
   * render invocations before a commit (StrictMode double-invoke, concurrent
   * re-render) all read the same value and SSR hydration stays free of
   * mismatches. From the first commit on, the committed children are
   * authoritative — even when empty.
   */
  const isBeforeFirstCommit = useRef(true);
  useLayoutEffect(() => {
    isBeforeFirstCommit.current = false;
  }, []);

  const tunnelChildren = useTunnelState(providerId).getEntries(
    id,
    isSsr || isBeforeFirstCommit.current,
  );

  /**
   * Entries rendered after the exit commit their children in their own layout
   * effects. The observer only picks that up once it subscribes, in a passive
   * effect — and React runs the passive effects of a Suspense reveal or a
   * transition after paint, so the browser shows one frame with an empty exit.
   * A re-render dispatched from a layout effect runs synchronously, after every
   * layout effect of the commit and before paint. Only needed while the exit
   * has not rendered committed entries yet.
   */
  const [, rerender] = useReducer((count: number) => count + 1, 0);
  const hasRenderedCommittedEntries = tunnelChildren?.committed === true;
  useLayoutEffect(() => {
    if (!hasRenderedCommittedEntries) {
      rerender();
    }
  }, [hasRenderedCommittedEntries]);

  const renderedTunnelChildren = tunnelChildren?.entries.map((entry) => (
    <ChildrenRenderer key={entry.id}>{entry.children}</ChildrenRenderer>
  ));

  if (typeof children === "function") {
    return children(renderedTunnelChildren);
  }

  return renderedTunnelChildren ?? children;
});

export default TunnelExit;
