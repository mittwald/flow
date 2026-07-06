import {
  createContext,
  type FC,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";

export type DeprecationWarningHandler = (message: string) => void;

export interface DeprecationWarningProviderProps extends PropsWithChildren {
  onWarning?: DeprecationWarningHandler;
}

export const DeprecationWarningContext = createContext<
  DeprecationWarningHandler | undefined
>(undefined);

export const DeprecationWarningProvider: FC<
  DeprecationWarningProviderProps
> = (props) => {
  const { children, onWarning } = props;

  return (
    <DeprecationWarningContext.Provider value={onWarning}>
      {children}
    </DeprecationWarningContext.Provider>
  );
};

export const useWarnDeprecation = () => {
  const onWarning = useContext(DeprecationWarningContext);
  const reportedWarnings = useRef(new Set<string>());
  const pendingWarnings = useRef<string[]>([]);

  useEffect(() => {
    const warnings = pendingWarnings.current;
    pendingWarnings.current = [];

    for (const message of warnings) {
      console.warn(message);
      onWarning?.(message);
    }
  });

  return useCallback(
    (message: string) => {
      if (reportedWarnings.current.has(message)) {
        return;
      }

      reportedWarnings.current.add(message);
      pendingWarnings.current.push(message);
    },
    [],
  );
};

export default DeprecationWarningProvider;
