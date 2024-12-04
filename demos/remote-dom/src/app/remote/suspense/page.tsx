"use client";
import { Suspense, Button } from "@mittwald/flow-remote-react-components";
import { useEffect, useState } from "react";

interface Data {
  generated: string;
}

const createDataFetcher = () => {
  let data: Data | undefined;
  let promise: Promise<null> | undefined;

  const fetchData = () => {
    promise = new Promise((resolve) => {
      setTimeout(() => {
        data = {
          generated: "Generated: " + new Date().toLocaleString("de-DE"),
        };
        resolve(null);
      }, 1_000);
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

const EnhancedDataComponent = () => {
  const data = fetcher.read();
  const [reloadTimer, setReloadTimer] = useState(5);
  const [buttonPressState, setButtonPressState] = useState(0);

  useEffect(() => {
    let timer: unknown;

    if (reloadTimer <= 0) {
      fetcher.reset();
      setReloadTimer(5);
    } else {
      timer = setTimeout(() => {
        setReloadTimer((t) => t - 1);
      }, 1_000);
    }

    return () => {
      if (timer) {
        clearInterval(timer as number);
      }
    };
  }, [reloadTimer]);

  return (
    <>
      <>Promise API DATA: "{data.generated}"</>
      <Button onPress={() => setButtonPressState((p) => p + 1)}>
        Button {buttonPressState}x clicked
      </Button>
      Reload Data in {reloadTimer} seconds...
    </>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<>Loading....</>}>
      <EnhancedDataComponent />
    </Suspense>
  );
}
