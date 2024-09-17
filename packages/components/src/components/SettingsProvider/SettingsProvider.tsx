import type { FC, PropsWithChildren } from "react";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import type { SupportedSettingsBackend } from "@/components/SettingsProvider/backends/types";
import { autorun } from "mobx";
import { usePromise } from "@mittwald/react-use-promise";
import { SettingsStore } from "@/components/SettingsProvider/models/SettingsStore";
import { settingsBackendFactory } from "@/components/SettingsProvider/backends/settingsBackendFactory";

type Props = PropsWithChildren &
  SupportedSettingsBackend & {
    id?: string;
  };

const context = createContext<SettingsStore | undefined>(undefined);

export const useSettings = () => useContext(context);

export const SettingsProvider: FC<Props> = (props) => {
  const { children, id, ...storeShape } = props;
  const store = settingsBackendFactory(storeShape);

  const firstAutorun = useRef(true);
  const storingPromise = useRef(Promise.resolve());
  const storedSettings = usePromise(() => store.load(), [], {
    loaderId: id,
  });
  const settings = useMemo(() => SettingsStore.fromJson(storedSettings), []);

  useEffect(
    () =>
      autorun(() => {
        // skip initial autorun
        if (firstAutorun.current) {
          firstAutorun.current = false;
          return;
        }
        const asJson = settings.asJson;
        storingPromise.current = storingPromise.current.then(() =>
          store.store(asJson),
        );
      }),
    [settings, id],
  );

  return <context.Provider value={settings}>{children}</context.Provider>;
};
