export const nestingLevelKey = "___nestingLevel" as const;

export type NestingLevelKey = typeof nestingLevelKey;

export interface NestingLevelProps {
  [nestingLevelKey]?: number;
}
