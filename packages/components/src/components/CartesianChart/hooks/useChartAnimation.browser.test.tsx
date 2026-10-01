import { renderHook } from "vitest-browser-react";
import { expect, test } from "vitest";
import { useChartAnimation } from "@/components/CartesianChart/hooks/useChartAnimation";

test("recharts does not animate under reduced motion", async () => {
  const { result } = await renderHook(() => useChartAnimation());

  expect(result.current).toEqual({
    isAnimationActive: false,
    animationDuration: 800,
    animationEasing: "ease",
  });
});
