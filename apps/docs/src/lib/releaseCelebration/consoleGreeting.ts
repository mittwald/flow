import {
  hasReleased,
  RELEASE_VERSION,
} from "@/lib/releaseCelebration/celebration";

// Module-level guard: React Strict Mode mounts effects twice in dev, and we
// don't want the greeting logged twice.
let greeted = false;

const flowGradient =
  "background: linear-gradient(90deg, #2f5bff, #7b3fff); color: #fff; " +
  "font-weight: 700; padding: 4px 10px; border-radius: 4px;";

const dim = "color: #888;";

/**
 * A nerdy greeting for anyone who opens the DevTools console — the docs' core
 * audience are developers, so this is where a hidden hello belongs. Switches to
 * a special message once Flow has shipped 1.0.0.
 */
export const logConsoleGreeting = (): void => {
  if (greeted || typeof window === "undefined") {
    return;
  }
  greeted = true;

  if (hasReleased()) {
    console.log(
      `%c Flow ${RELEASE_VERSION} `,
      flowGradient,
      `\n🚀 We shipped ${RELEASE_VERSION}. Thanks for building with Flow.\n` +
        "→ https://github.com/mittwald/flow",
    );
    return;
  }

  console.log(
    "%c Flow ",
    flowGradient,
    "%cbuilt in the open → https://github.com/mittwald/flow",
    dim,
  );
};
