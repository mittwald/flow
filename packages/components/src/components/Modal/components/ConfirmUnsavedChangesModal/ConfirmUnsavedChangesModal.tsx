import ContentView from "@/views/ContentView";
import HeadingView from "@/views/HeadingView";
import type { FC } from "react";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "../../locales/*.locale.json";
import Modal from "@/components/Modal/Modal";
import TextView from "@/views/TextView";
import ActionGroupView from "@/views/ActionGroupView";
import Action from "@/components/Action";
import ButtonView from "@/views/ButtonView";
import { useModalController } from "@/lib/controller";

export const ConfirmUnsavedChangesModal: FC = () => {
  const stringFormatter = useLocalizedStringFormatter(locales);
  const closeConfirmationController =
    useModalController().useConfirmationController();

  if (closeConfirmationController) {
    const { controller, confirm, cancel } = closeConfirmationController;

    return (
      <Modal controller={controller}>
        <HeadingView>
          {stringFormatter.format("unsavedChangesConfirmationModal.heading")}
        </HeadingView>
        <ContentView>
          <TextView>
            {stringFormatter.format("unsavedChangesConfirmationModal.text")}
          </TextView>
        </ContentView>
        <ActionGroupView>
          <Action closeModal>
            <Action onAction={confirm}>
              <ButtonView color="danger">
                {stringFormatter.format(
                  "unsavedChangesConfirmationModal.close",
                )}
              </ButtonView>
            </Action>
            <Action onAction={cancel}>
              <ButtonView color="secondary" variant="soft">
                {stringFormatter.format(
                  "unsavedChangesConfirmationModal.keepOpen",
                )}
              </ButtonView>
            </Action>
          </Action>
        </ActionGroupView>
      </Modal>
    );
  }
};

export default ConfirmUnsavedChangesModal;
