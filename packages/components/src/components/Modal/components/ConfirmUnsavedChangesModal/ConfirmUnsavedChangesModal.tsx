import ContentView from "@/views/ContentView";
import HeadingView from "@/views/HeadingView";
import type { FC } from "react";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import locales from "../../locales/*.locale.json";
import Modal from "@/components/Modal/Modal";
import TextView from "@/views/TextView";
import ActionGroupView from "@/views/ActionGroupView";
import Action from "@/components/Action";
import ButtonView from "@/views/ButtonView";
import { useModalController } from "@/lib/controller";

/**
 * Rendered by every `Modal` and only becomes active once something requires the
 * close to be confirmed – the `confirmOnClose` prop or a dirty `Form`.
 */
export const ConfirmUnsavedChangesModal: FC = () => {
  const stringFormatter = useLocalizedStringFormatter(locales, "Modal");
  const modalController = useModalController();
  const confirmOnCloseEnabled = modalController.useConfirmOnCloseEnabled();
  const closeConfirmationController =
    modalController.useConfirmationController();

  if (confirmOnCloseEnabled && closeConfirmationController) {
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
