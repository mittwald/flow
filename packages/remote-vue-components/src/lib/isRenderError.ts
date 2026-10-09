/**
 * Whether Vue's `onErrorCaptured` info names a render or setup error — what
 * React's error boundary catches. Vue names the source in development and links
 * its error code in production (`…/error-reference/#runtime-1`).
 */
export const isRenderError = (info: string): boolean =>
  info === "render function" ||
  info === "setup function" ||
  /#runtime-[01]$/.test(info);
