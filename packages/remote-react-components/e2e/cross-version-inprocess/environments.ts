// Injected in place of `@/tests/lib/environments` so unmodified visual tests
// run only under the in-process CrossVersion environment.
import { crossVersionEnvironment } from "./crossVersionEnvironment";

export const testEnvironments = [crossVersionEnvironment] as const;
