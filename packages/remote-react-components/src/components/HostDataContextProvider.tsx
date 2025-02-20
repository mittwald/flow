import {
  createContext,
  useContext,
  useEffect,
  useState,
  type FC,
  type PropsWithChildren,
} from "react";

interface Context {
  data?: unknown;
}

export const hostDataContext = createContext<Context>({});

type Props = PropsWithChildren;

export const useHostData = () => useContext(hostDataContext).data;

export const HostDataProvider: FC<Props> = (props) => {
  const { children } = props;

  const [data, setData] = useState<unknown>(undefined);

  const handleDataRecevied = (event: Event) => {
    if (event instanceof CustomEvent) {
      setData(event.detail);
    }
  };

  useEffect(() => {
    window.addEventListener("flr-data-received", handleDataRecevied);
    return () => {
      window.removeEventListener("flr-data-received", handleDataRecevied);
    };
  });

  return (
    <hostDataContext.Provider value={{ data }}>
      {children}
    </hostDataContext.Provider>
  );
};
