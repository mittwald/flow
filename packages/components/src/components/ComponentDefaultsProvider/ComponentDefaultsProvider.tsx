import {
  builtInComponentDefaults,
  type ComponentDefaults,
  type ComponentWithDefaults,
  type PartialComponentDefaults,
} from "@/components/ComponentDefaultsProvider/defaults";
import { useDeprecatedFlagDefaults } from "@/components/ComponentDefaultsProvider/deprecatedFlags";
import {
  createContext,
  type FC,
  type PropsWithChildren,
  useContext,
  useMemo,
} from "react";

export const ComponentDefaultsContext = createContext<PartialComponentDefaults>(
  {},
);

export interface ComponentDefaultsProviderProps extends PropsWithChildren {
  /**
   * Defaults per component. Every setting that is not given keeps the default
   * of a surrounding ComponentDefaultsProvider, or its built-in default.
   */
  defaults: PartialComponentDefaults;
}

const mergeDefaults = (
  base: PartialComponentDefaults,
  override: PartialComponentDefaults,
): PartialComponentDefaults => {
  const merged: PartialComponentDefaults = { ...base };

  for (const component of Object.keys(override) as ComponentWithDefaults[]) {
    Object.assign(merged, {
      [component]: { ...base[component], ...override[component] },
    });
  }

  return merged;
};

/**
 * Defines the default behavior of components for the whole application – or,
 * nested, for a part of it.
 *
 * @flowStatus new
 */
export const ComponentDefaultsProvider: FC<ComponentDefaultsProviderProps> = (
  props,
) => {
  const { defaults, children } = props;
  const inheritedDefaults = useContext(ComponentDefaultsContext);

  const value = useMemo(
    () => mergeDefaults(inheritedDefaults, defaults),
    [inheritedDefaults, defaults],
  );

  return (
    <ComponentDefaultsContext.Provider value={value}>
      {children}
    </ComponentDefaultsContext.Provider>
  );
};

/**
 * The defaults that apply to a component: built-in defaults, overridden by the
 * deprecated `flags` object, overridden by the ComponentDefaultsProvider.
 */
export const useComponentDefaults = <C extends ComponentWithDefaults>(
  component: C,
): ComponentDefaults[C] => {
  const fromContext = useContext(ComponentDefaultsContext)[component];
  const fromDeprecatedFlags = useDeprecatedFlagDefaults(component);

  return {
    ...builtInComponentDefaults[component],
    ...fromDeprecatedFlags,
    ...fromContext,
  };
};

export default ComponentDefaultsProvider;
