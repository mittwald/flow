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
  const backend = settingsBackendFactory(storeShape);

  const storingPromise = useRef(Promise.resolve());
  const storedSettings = usePromise(() => backend.load(), [], {
    loaderId: id,
  });

  const settingsStore = useMemo(
    () => SettingsStore.fromJson(storedSettings),
    [id],
  );

  useEffect(
    () =>
      autorun(() => {
        const json = settingsStore.asJson;
        storingPromise.current = storingPromise.current.then(() =>
          backend.store(json),
        );
      }),
    [id],
  );

  return <context.Provider value={settingsStore}>{children}</context.Provider>;
};
