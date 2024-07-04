import UserEvent from "@testing-library/user-event";
import { vitest } from "vitest";

export const userEvent = UserEvent.setup({
  advanceTimers: (ms) => vitest.advanceTimersByTime(ms),
});

export default userEvent;
