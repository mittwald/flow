import type { FC, PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import type { SupportedSettingsBackend } from "@/components/SettingsProvider/backends/types";
import { autorun } from "mobx";
import { getAsyncResource } from "@mittwald/react-use-promise";
import {
  SettingsStore,
  type SettingsStoreOptions,
} from "@/components/SettingsProvider/models/SettingsStore";
import { settingsBackendFactory } from "@/components/SettingsProvider/backends/settingsBackendFactory";

type Props = PropsWithChildren &
  SupportedSettingsBackend & {
    id?: string;
  } & Pick<SettingsStoreOptions, "middleware">;

const context = createContext<SettingsStore | undefined>(undefined);

export const useSettings = () => useContext(context);

export const SettingsProvider: FC<Props> = (props) => {
  const { children, middleware, id = "static", ...storeShape } = props;
  const backend = settingsBackendFactory(storeShape);

  const settingsResource = getAsyncResource(() => backend.load(), [], {
    loaderId: id,
  });
  const settings = settingsResource.use();

  const storingPromise = useRef(Promise.resolve());
  const parentStore = useSettings();

  const settingsStore = useMemo(
    () => SettingsStore.fromJson(settings, { middleware, parentStore }),
    [id],
  );

  const watchAndStoreSettings = () => {
    const json = settingsStore.asJson;
    storingPromise.current = storingPromise.current.then(async () => {
      await backend.store(json);
    });
  };

  useEffect(() => autorun(watchAndStoreSettings), [id]);

  return <context.Provider value={settingsStore}>{children}</context.Provider>;
};

export default SettingsProvider;
