const breakActionMarker = "flowBreakActionMarker" as const;

export function isBreakActionError(something: unknown): boolean {
  return (
    !!something &&
    something instanceof Error &&
    something.message === breakActionMarker
  );
}

export const breakAction = (): void => {
  throw new Error(breakActionMarker);
};
