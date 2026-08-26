"use client";
import { type FC, useCallback, useEffect, useRef, useState } from "react";
import styles from "./ReleaseCelebration.module.scss";
import {
  FORCE_QUERY_PARAM,
  isCelebrationActive,
  RELEASE_VERSION,
  STORAGE_KEY,
} from "@/lib/releaseCelebration/celebration";
import { logConsoleGreeting } from "@/lib/releaseCelebration/consoleGreeting";

const COMMAND = "npm i @mittwald/flow-react-components@latest";
const TYPE_BASE_MS = 34; // baseline per-character delay
const TYPE_JITTER_MS = 42; // random spread on top — makes it uneven
const HESITATE_CHANCE = 0.1; // odds of a longer stumble before a character
const HESITATE_MS = 170; // extra pause when a stumble hits
const PAUSE_AFTER_CMD_MS = 260; // beat after "npm", before the arguments
const OUTPUT_DELAY_MS = 450; // suspense between Enter and npm's output
const AUTO_DISMISS_MS = 6000;

// Index right after the command word — pause there before the arguments.
const PAUSE_AFTER_INDEX = COMMAND.indexOf(" ");

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * A one-time terminal reveal that types `$ flow --version → 1.0.0 🚀` when the
 * docs first load on 1.0.0. Fires once per browser within the release window;
 * `?celebrate` forces it for preview. Always logs a console greeting.
 */
const ReleaseCelebration: FC = () => {
  const [visible, setVisible] = useState(false);
  const [typed, setTyped] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const dismiss = useCallback(() => {
    setLeaving(true);
    timers.current.push(setTimeout(() => setVisible(false), 250));
  }, []);

  // Decide whether to reveal, and log the console greeting (always).
  useEffect(() => {
    logConsoleGreeting();

    const isForced = new URLSearchParams(window.location.search).has(
      FORCE_QUERY_PARAM,
    );
    if (isForced) {
      setVisible(true);
      return;
    }

    if (!isCelebrationActive()) {
      return;
    }
    if (window.localStorage.getItem(STORAGE_KEY)) {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    setVisible(true);
  }, []);

  // Run the typewriter once visible.
  useEffect(() => {
    if (!visible) {
      return;
    }

    if (prefersReducedMotion()) {
      setTyped(COMMAND);
      setShowOutput(true);
      timers.current.push(setTimeout(dismiss, AUTO_DISMISS_MS));
      return;
    }

    // Uneven, human-ish cadence: a jittered base delay plus the occasional
    // longer stumble, scheduled one character at a time.
    const nextDelay = (): number =>
      TYPE_BASE_MS +
      Math.random() * TYPE_JITTER_MS +
      (Math.random() < HESITATE_CHANCE ? HESITATE_MS + Math.random() * 220 : 0);

    const typeChar = (count: number): void => {
      setTyped(COMMAND.slice(0, count));
      if (count >= COMMAND.length) {
        timers.current.push(
          setTimeout(() => {
            setShowOutput(true);
            timers.current.push(setTimeout(dismiss, AUTO_DISMISS_MS));
          }, OUTPUT_DELAY_MS),
        );
        return;
      }
      const pause = count === PAUSE_AFTER_INDEX ? PAUSE_AFTER_CMD_MS : 0;
      timers.current.push(
        setTimeout(() => typeChar(count + 1), nextDelay() + pause),
      );
    };

    timers.current.push(setTimeout(() => typeChar(1), nextDelay()));
  }, [visible, dismiss]);

  // Escape closes; clean up every timer on unmount.
  useEffect(() => {
    if (!visible) {
      return;
    }
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        dismiss();
      }
    };
    window.addEventListener("keydown", onKey);
    const currentTimers = timers.current;
    return () => {
      window.removeEventListener("keydown", onKey);
      currentTimers.forEach(clearTimeout);
    };
  }, [visible, dismiss]);

  if (!visible) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div
        className={
          leaving ? `${styles.terminal} ${styles.leaving}` : styles.terminal
        }
      >
        <div className={styles.titleBar}>
          <span className={styles.dot} data-color="red" aria-hidden="true" />
          <span className={styles.dot} data-color="yellow" aria-hidden="true" />
          <span className={styles.dot} data-color="green" aria-hidden="true" />
          <span className={styles.title} aria-hidden="true">
            flow
          </span>
          <button
            type="button"
            className={styles.close}
            onClick={dismiss}
            aria-label="Schließen"
          >
            ×
          </button>
        </div>
        {/* The typewriter is a visual effect; hide it from assistive tech to
            avoid announcing every keystroke. */}
        <div className={styles.body} aria-hidden="true">
          <p className={styles.line}>
            <span className={styles.prompt}>$</span> {typed}
            {!showOutput && <span className={styles.cursor} />}
          </p>
          {showOutput && (
            <>
              <p className={styles.installed}>
                + @mittwald/flow-react-components@
                <span className={styles.version}>{RELEASE_VERSION}</span> 🚀
              </p>
              <p className={styles.meta}>added 1 package in 1.2s</p>
              <p className={styles.audit}>found 0 vulnerabilities</p>
            </>
          )}
        </div>
        {/* One clean announcement once the reveal has landed. */}
        {showOutput && (
          <p className={styles.visuallyHidden} role="status">
            Flow {RELEASE_VERSION} ist veröffentlicht.
          </p>
        )}
      </div>
    </div>
  );
};

export default ReleaseCelebration;
