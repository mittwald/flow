export interface Flags {
  /**
   * @deprecated Closing a `Modal` that contains a `Form` with unsaved changes
   *   must be confirmed by default now
   *   (`Form.confirmModalCloseOnUnsavedChanges: true`). Use the `defaults`
   *   property of the `ComponentDefaultsProvider` instead – assigning this flag
   *   still works, but it will be removed in a future release.
   */
  requireCloseModalConfirmationOnUnsavedChanges: boolean;
  /**
   * @deprecated Its default is unchanged (`List.disableInitialSuspenseBoundary:
   *   false`). Use the `defaults` property of the `ComponentDefaultsProvider`
   *   instead – assigning this flag still works, but it will be removed in a
   *   future release.
   */
  disableInitialListSuspenseBoundaries: boolean;
}

export type FlagName = keyof Flags;

/**
 * Fallback values of the flags. Only used when an application neither assigns
 * the flag nor provides a `ComponentDefaultsProvider`; the built-in defaults of
 * the affected components are the single source of truth for them.
 */
const flagDefaults: Flags = {
  requireCloseModalConfirmationOnUnsavedChanges: true,
  disableInitialListSuspenseBoundaries: false,
};

const flagValues: Flags = { ...flagDefaults };

/**
 * Flags an application has assigned itself. Only these contribute a default
 * (and a deprecation warning) – a flag left alone is not a deprecated usage.
 */
const assignedFlags = new Set<FlagName>();

/**
 * Behavior toggles of the component library.
 *
 * @deprecated Use the `defaults` property of the `ComponentDefaultsProvider`
 *   instead.
 */
export const flags: Flags = {} as Flags;

const defineFlag = (name: FlagName): void => {
  Object.defineProperty(flags, name, {
    enumerable: true,
    get: () => flagValues[name],
    set: (value: boolean) => {
      assignedFlags.add(name);
      flagValues[name] = value;
    },
  });
};

(Object.keys(flagDefaults) as FlagName[]).forEach(defineFlag);

/** @internal */
export const flagIsAssigned = (name: FlagName): boolean =>
  assignedFlags.has(name);

export const resetFlags = () => {
  Object.assign(flagValues, flagDefaults);
  assignedFlags.clear();
};
