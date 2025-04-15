import React, { type FC, Suspense, useState } from "react";
import { expect, test, vitest } from "vitest";
import { render } from "@testing-library/react";
import { AsyncResource } from "@mittwald/react-use-promise";
import Link from "@/components/Link/Link";
import {
  TunnelExit,
  TunnelProvider,
  TunnelEntry,
} from "@mittwald/react-tunnel";
import { Navigation } from "@/components/Navigation";

test("Content from entry is updated in exit", async () => {
  vitest.useFakeTimers();

  const EnhancedDataComponent = (foo = "", waitFor = 5): FC => {
    const getDateNowResource = new AsyncResource(
      () =>
        new Promise<number>((res) => {
          setTimeout(() => res(waitFor), waitFor * 1000);
        }),
    );
    return () => {
      const value = getDateNowResource.use({
        keepValueWhileLoading: false,
      });

      return <Link>{foo}</Link>;
    };
  };

  const Foo = EnhancedDataComponent("[Content-1]", 1);
  const Bar = EnhancedDataComponent("[Content-2]", 10);
  const Baz = EnhancedDataComponent("[Content-3]", 6);

  const asd = (
    <TunnelProvider>
      <Navigation>
        <Suspense>
          <Foo />
        </Suspense>
        <Suspense>
          <Bar />
        </Suspense>
        <Suspense>
          <Baz />
        </Suspense>
      </Navigation>
    </TunnelProvider>
  );

  const dom = render(asd);
  await vitest.advanceTimersByTimeAsync(15000);
  dom.rerender(asd);

  dom.debug();
});
