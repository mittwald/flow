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

type Props = PropsWithChildren & SupportedSettingsBackend;

const context = createContext<SettingsStore | undefined>(undefined);

export const useSettings = () => useContext(context);

export const SettingsProvider: FC<Props> = (props) => {
  const { children, ...storeShape } = props;
  const store = settingsBackendFactory(storeShape);

  const storingPromise = useRef(Promise.resolve());
  const storedSettings = usePromise(() => store.load(), []);
  const settings = useMemo(() => SettingsStore.fromJson(storedSettings), []);

  useEffect(
    () =>
      autorun(() => {
        const asJson = settings.asJson;
        storingPromise.current = storingPromise.current.then(() =>
          store.store(asJson),
        );
      }),
    [settings],
  );

  return <context.Provider value={settings}>{children}</context.Provider>;
};
