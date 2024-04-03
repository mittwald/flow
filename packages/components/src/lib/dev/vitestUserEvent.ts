import UserEvent from "@testing-library/user-event";
import { vitest } from "vitest";

export const userEvent = UserEvent.setup({
  advanceTimers: async (ms) => await vitest.advanceTimersByTimeAsync(ms),
});

export default userEvent;
