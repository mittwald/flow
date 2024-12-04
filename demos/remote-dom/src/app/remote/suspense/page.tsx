"use client";
import { Button } from "@mittwald/flow-remote-react-components";
import { Suspense, useState } from "react";
import { useEffect } from "react";

export const useIsMounted = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(
    () => {
      setIsMounted(true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  return isMounted;
};

interface Data {
  title: string;
}

const createDataFetcher = () => {
  let data: Data | undefined;
  let promise: Promise<null> | undefined;

  const fetchData = () => {
    promise = new Promise((resolve) => {
      setTimeout(() => {
        data = {
          title: "Ik bin ein Berliner",
        };
        resolve(null);
      }, 5000);
    });
    return promise;
  };

  return {
    read: () => {
      if (data) {
        return data;
      }
      if (promise) {
        throw promise;
      }

      throw fetchData();
    },
    reset: () => {
      promise = undefined;
      data = undefined;
    },
  };
};

const fetcher = createDataFetcher();

const CrazyButton = () => {
  const data = fetcher.read();
  const [foo, setFoo] = useState(false);

  useEffect(() => {
    const foo = setInterval(() => {
      fetcher.reset();
      setFoo((p) => !p);
    }, 8000);

    return () => {
      clearInterval(foo);
    };
  }, []);

  return <Button>{data.title}</Button>;
};

export default function Page() {
  const isMounted = useIsMounted();

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Suspense fallback={<Button>Loading....</Button>}>
        <CrazyButton />
      </Suspense>
    </>
  );
}
