import {
  createContext,
  type FC,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type DeprecationWarningHandler = (message: string) => void;

export interface DeprecationWarningProviderProps extends PropsWithChildren {
  onWarning?: DeprecationWarningHandler;
}

export const DeprecationWarningContext = createContext<
  DeprecationWarningHandler | undefined
>(undefined);

/**
 * Messages a provider has passed to its `onWarning`. Held by the provider, not
 * keyed by the handler: an inline `onWarning` is a new function on every
 * render.
 */
const ReportedWarningsContext = createContext<Set<string> | undefined>(
  undefined,
);

/** Messages already written to `console.warn`, across all providers. */
const consoleReportedWarnings = new Set<string>();

/**
 * Fallback for a bare `DeprecationWarningContext.Provider`, which has no
 * provider-held set.
 */
const reportedWarningsByHandler = new WeakMap<
  DeprecationWarningHandler,
  Set<string>
>();

const getHandlerReportedWarnings = (handler: DeprecationWarningHandler) => {
  let reported = reportedWarningsByHandler.get(handler);
  if (!reported) {
    reported = new Set();
    reportedWarningsByHandler.set(handler, reported);
  }
  return reported;
};

export const DeprecationWarningProvider: FC<DeprecationWarningProviderProps> = (
  props,
) => {
  const { children, onWarning } = props;
  const [reportedWarnings] = useState(() => new Set<string>());

  return (
    <DeprecationWarningContext.Provider value={onWarning}>
      <ReportedWarningsContext.Provider value={reportedWarnings}>
        {children}
      </ReportedWarningsContext.Provider>
    </DeprecationWarningContext.Provider>
  );
};

export const useWarnDeprecation = () => {
  const onWarning = useContext(DeprecationWarningContext);
  const providerReportedWarnings = useContext(ReportedWarningsContext);
  const handlerReportedWarnings = onWarning
    ? (providerReportedWarnings ?? getHandlerReportedWarnings(onWarning))
    : undefined;

  const pendingWarnings = useRef<string[]>([]);

  useEffect(() => {
    if (pendingWarnings.current.length === 0) {
      return;
    }

    const warnings = pendingWarnings.current;
    pendingWarnings.current = [];

    for (const message of warnings) {
      if (!consoleReportedWarnings.has(message)) {
        consoleReportedWarnings.add(message);
        console.warn(message);
      }
      if (onWarning && !handlerReportedWarnings?.has(message)) {
        handlerReportedWarnings?.add(message);
        onWarning(message);
      }
    }
  });

  return useCallback(
    (message: string) => {
      const isReported =
        consoleReportedWarnings.has(message) &&
        (handlerReportedWarnings?.has(message) ?? true);

      if (isReported || pendingWarnings.current.includes(message)) {
        return;
      }
      pendingWarnings.current.push(message);
    },
    [handlerReportedWarnings],
  );
};

export default DeprecationWarningProvider;
