export const nestingLevelKey = "___nestingLevel" as const;

export type NestingLevelKey = typeof nestingLevelKey;

/** @internal */
export interface NestingLevelProps {
  [nestingLevelKey]?: number;
}
