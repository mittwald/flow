import type { FC, PropsWithChildren } from "react";
import type { AlphaColor, PropsWithClassName } from "@/lib/types/props";
import ButtonView from "@/views/ButtonView";
import ContextualHelpTriggerView from "@/views/ContextualHelpTriggerView";

interface Props extends PropsWithChildren, PropsWithClassName {
  color: AlphaColor;
  isDisabled?: boolean;
}

/**
 * Supplies the trigger button for a contextual help placed in a badge, so the
 * consumer only writes the <ContextualHelp>. Icon and accessibility label come
 * from the trigger.
 *
 * This renders at the badge's tunnel exit, which sits inside the badge's props
 * context — so the trigger has to pin itself, or the context the badge sets for
 * a trigger the consumer wrote would send it back into the tunnel it just
 * left.
 */
export const ContextualHelpButton: FC<Props> = (props) => {
  const { className, color, isDisabled, children } = props;

  return (
    <ContextualHelpTriggerView tunnel={null}>
      <ButtonView
        className={className}
        color={color}
        variant="plain"
        size="s"
        isDisabled={isDisabled}
      />
      {children}
    </ContextualHelpTriggerView>
  );
};

export default ContextualHelpButton;
