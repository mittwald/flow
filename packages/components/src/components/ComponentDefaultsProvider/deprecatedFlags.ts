import { useWarnDeprecation } from "@/components/DeprecationWarningProvider";
import type {
  ComponentDefaults,
  ComponentWithDefaults,
} from "@/components/ComponentDefaultsProvider/defaults";
import { flagIsAssigned, flags, type FlagName } from "@/flags";

interface DeprecatedFlagBridge {
  flag: FlagName;
  component: ComponentWithDefaults;
  setting: string;
  message: string;
}

/**
 * The global `flags` object is superseded by the ComponentDefaultsProvider. A
 * flag an application still assigns keeps working – it acts as the application
 * wide default below the provider – and warns about its replacement.
 */
const deprecatedFlagBridges: DeprecatedFlagBridge[] = [
  {
    flag: "requireCloseModalConfirmationOnUnsavedChanges",
    component: "Form",
    setting: "confirmModalCloseOnUnsavedChanges",
    message:
      "The 'requireCloseModalConfirmationOnUnsavedChanges' flag is deprecated and will be removed in a future release. Confirming the close of a Modal that contains a Form with unsaved changes is the default now ('Form.confirmModalCloseOnUnsavedChanges: true'). Use the 'defaults' property of the ComponentDefaultsProvider to change it.",
  },
  {
    flag: "disableInitialListSuspenseBoundaries",
    component: "List",
    setting: "disableInitialSuspenseBoundary",
    message:
      "The 'disableInitialListSuspenseBoundaries' flag is deprecated and will be removed in a future release. Its default is unchanged ('List.disableInitialSuspenseBoundary: false'). Use the 'defaults' property of the ComponentDefaultsProvider to change it.",
  },
];

/**
 * Defaults an application still contributes through the deprecated `flags`
 * object. Ranks below the ComponentDefaultsProvider and above the built-in
 * defaults.
 */
export const useDeprecatedFlagDefaults = <C extends ComponentWithDefaults>(
  component: C,
): Partial<ComponentDefaults[C]> => {
  const warnDeprecation = useWarnDeprecation();
  const fromFlags: Record<string, boolean> = {};

  for (const bridge of deprecatedFlagBridges) {
    if (bridge.component !== component || !flagIsAssigned(bridge.flag)) {
      continue;
    }

    warnDeprecation(bridge.message);
    fromFlags[bridge.setting] = flags[bridge.flag];
  }

  return fromFlags as Partial<ComponentDefaults[C]>;
};
