import {
  Action,
  ActionGroup,
  Button,
  CodeBlock,
  Content,
  Heading,
  Modal,
  ModalTrigger,
} from "@mittwald/flow-react-components";

export default () => {
  const log = `[2026-08-10 03:00:01] INFO  cron: starting job "backup-database"
[2026-08-10 03:00:01] INFO  backup: dumping database "app_production"
[2026-08-10 03:00:14] INFO  backup: 248.6 MB written to /backups/2026-08-10.sql.gz
[2026-08-10 03:00:15] WARN  backup: retention exceeded, removing /backups/2026-07-27.sql.gz
[2026-08-10 03:00:15] INFO  cron: job "backup-database" finished with exit code 0`;

  return (
    <ModalTrigger>
      <Button variant="soft" color="secondary">
        Log anzeigen
      </Button>
      <Modal size="m" offCanvas>
        <Heading>
          Cronjob „backup-database" – Durchlauf vom
          10.08.2026
        </Heading>
        <Content>
          <CodeBlock language="log" code={log} />
        </Content>
        <ActionGroup>
          <Action closeModal>
            <Button variant="soft" color="secondary">
              Schließen
            </Button>
          </Action>
        </ActionGroup>
      </Modal>
    </ModalTrigger>
  );
};
