import { type FC } from "react";
import styles from "@/components/MarkdownEditor/MarkdownEditor.module.scss";
import {
  IconBold,
  IconCode,
  IconItalic,
  IconLink,
  IconOrderedList,
  IconQuote,
  IconStrikeThrough,
  IconUnorderedList,
} from "@/components/Icon/components/icons";
import {
  ToolbarButton,
  type ToolBarButtonProps,
} from "@/components/MarkdownEditor/components/ToolbarButton";
import {
  ModeButton,
  type ModeButtonProps,
} from "@/components/MarkdownEditor/components/ModeButton";
import { type ButtonProps } from "@/components/Button";
import { type InsertType } from "@/components/MarkdownEditor/lib/modifyValueByType";
import { UiComponentTunnelExit } from "@/components/UiComponentTunnel/UiComponentTunnelExit";
import { AttachmentButton } from "@/components/MarkdownEditor/components/AttachmentButton";

interface ToolbarProps extends Pick<ButtonProps, "isDisabled"> {
  currentMode: ModeButtonProps["currentMode"];
  onModeChange: ModeButtonProps["onChange"];
  onToolPressed: (type: InsertType) => void;
  /** Which file types the attachment button offers. */
  accept?: string;
  /** Renders the attachment button when set. */
  onFilesSelected?: (files: File[]) => void;
  /**
   * Disables the attachment button, which a read-only editor takes no files
   * for.
   */
  isReadOnly?: boolean;
}

export const Toolbar: FC<ToolbarProps> = (props) => {
  const isDisabled = props.isDisabled || props.currentMode === "preview";

  /** The props of a tool that inserts markdown — all of them but the attachment. */
  const insertTool = (type: InsertType): ToolBarButtonProps => ({
    type,
    isDisabled,
    onPress: () => props.onToolPressed(type),
  });

  return (
    <div className={styles.toolbar} role="toolbar">
      <div className={styles.toolbarButtons}>
        <ToolbarButton {...insertTool("bold")}>
          <IconBold />
        </ToolbarButton>

        <ToolbarButton {...insertTool("italic")}>
          <IconItalic />
        </ToolbarButton>

        <ToolbarButton {...insertTool("strikeThrough")}>
          <IconStrikeThrough />
        </ToolbarButton>

        <ToolbarButton {...insertTool("quote")}>
          <IconQuote />
        </ToolbarButton>

        <ToolbarButton {...insertTool("code")}>
          <IconCode />
        </ToolbarButton>

        <ToolbarButton {...insertTool("link")}>
          <IconLink />
        </ToolbarButton>

        <ToolbarButton {...insertTool("unorderedList")}>
          <IconUnorderedList />
        </ToolbarButton>

        <ToolbarButton {...insertTool("orderedList")}>
          <IconOrderedList />
        </ToolbarButton>

        {props.onFilesSelected && (
          <AttachmentButton
            accept={props.accept}
            isDisabled={isDisabled || props.isReadOnly}
            onSelect={props.onFilesSelected}
          />
        )}

        <UiComponentTunnelExit id="toolbarActions" component="MarkdownEditor" />
      </div>

      <ModeButton
        onChange={props.onModeChange}
        currentMode={props.currentMode}
        isDisabled={props.isDisabled ?? false}
      />
    </div>
  );
};
