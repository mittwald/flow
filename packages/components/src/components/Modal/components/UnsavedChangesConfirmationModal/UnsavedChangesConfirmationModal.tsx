import type { FC } from "react";
import type { OverlayController } from "@/lib/controller";
import { Action } from "@/components/Action";
import ModalBase from "@/components/Modal/ModalBase";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "../../locales/*.locale.json";
import ButtonView from "@/views/ButtonView";
import ActionGroupView from "@/views/ActionGroupView";
import ContentView from "@/views/ContentView";
import TextView from "@/views/TextView";
import HeadingView from "@/views/HeadingView";

interface Props {
  controller: OverlayController;
  unsavedChangesConfirmationController: OverlayController;
}

export const UnsavedChangesConfirmationModal: FC<Props> = (props) => {
  const { controller, unsavedChangesConfirmationController } = props;

  const stringFormatter = useLocalizedStringFormatter(locales);

  return (
    <ModalBase controller={unsavedChangesConfirmationController}>
      <HeadingView>
        {stringFormatter.format("unsavedChangesConfirmationModal.heading")}
      </HeadingView>
      <ContentView>
        <TextView>
          {stringFormatter.format("unsavedChangesConfirmationModal.text")}
        </TextView>
      </ContentView>
      <ActionGroupView>
        <Action closeOverlay="Modal">
          <Action onAction={() => controller.close()}>
            <ButtonView color="danger">
              {stringFormatter.format("unsavedChangesConfirmationModal.close")}
            </ButtonView>
          </Action>
          <ButtonView color="secondary" variant="soft">
            {stringFormatter.format("unsavedChangesConfirmationModal.keepOpen")}
          </ButtonView>
        </Action>
      </ActionGroupView>
    </ModalBase>
  );
};

export default UnsavedChangesConfirmationModal;
