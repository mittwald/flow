import { vi } from "vitest";
import UserEvent from "@testing-library/user-event";
import { act } from "react";

// Temporarily workaround for bug in @testing-library/react when use user-event with `vi.useFakeTimers()`
// https://github.com/testing-library/user-event/issues/1115
vi.stubGlobal("jest", {
  advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
});

export const userEventFakeTimer = UserEvent.setup({
  advanceTimers: vi.advanceTimersByTime,
});

export const advanceTime = async (ms: number) => {
  await act(() => vi.advanceTimersByTimeAsync(ms));
};
