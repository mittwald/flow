/**
 * Behavior of components that an application can define once, globally, instead
 * of repeating it at every usage. Every setting has a built-in default and
 * stays overridable at the component itself.
 */
export interface ComponentDefaults {
  List: {
    /**
     * Whether a `List` renders no own Suspense boundary while it initially
     * loads. Suspending is then handed over to the closest Suspense boundary
     * above the List, so the List appears with loaded data instead of showing
     * its loading view (skeleton) first.
     *
     * Overridable per List through the `disableInitialSuspenseBoundary`
     * property of its data source.
     *
     * @default false
     */
    disableInitialSuspenseBoundary: boolean;
  };
  Form: {
    /**
     * Whether closing a `Modal` that contains a `Form` with unsaved changes
     * must be confirmed. Applies as long as the Form is _dirty_ – after a
     * successful submit or a `form.reset()` it is not.
     *
     * @default true
     */
    confirmModalCloseOnUnsavedChanges: boolean;
  };
}

export type ComponentWithDefaults = keyof ComponentDefaults;

export type PartialComponentDefaults = {
  [C in ComponentWithDefaults]?: Partial<ComponentDefaults[C]>;
};

export const builtInComponentDefaults: ComponentDefaults = {
  List: {
    disableInitialSuspenseBoundary: false,
  },
  Form: {
    confirmModalCloseOnUnsavedChanges: true,
  },
};
