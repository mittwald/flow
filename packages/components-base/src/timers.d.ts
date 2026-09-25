/*
 * Timers exist wherever this package runs — every browser and Node — but
 * `lib: ["esnext"]` does not declare them, and the DOM lib would let `window`
 * and `document` in with them.
 */
declare function setTimeout(handler: () => void, timeout?: number): number;
declare function clearTimeout(id: number | undefined): void;
