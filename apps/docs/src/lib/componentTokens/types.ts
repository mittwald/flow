export interface ComponentToken {
  /** The CSS variable, e.g. `--button--padding-x` */
  name: string;
  light: string;
  /** Only set when it differs from `light` */
  dark?: string;
  /** Every token the chain passes on its way to the light value, in order */
  references?: string[];
  /** The chain to the dark value. Only set when it differs from `references` */
  darkReferences?: string[];
  /** The `calc()` a chain ends in, with `var(--…)` references */
  expression?: string;
}

/** Component tokens by namespace, e.g. `button` */
export type ComponentTokens = Record<string, ComponentToken[]>;
