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
[2026-08-10 03:00:01] INFO  backup: connecting to database "app_production"
[2026-08-10 03:00:02] INFO  backup: dumping database "app_production"
[2026-08-10 03:00:09] INFO  backup: 42 tables dumped, 1.284.902 rows total
[2026-08-10 03:00:14] INFO  backup: 248.6 MB written to /backups/2026-08-10.sql.gz
[2026-08-10 03:00:14] INFO  backup: verifying checksum sha256:9f2b…c41e
[2026-08-10 03:00:15] INFO  backup: upload to offsite storage "eu-central" started
[2026-08-10 03:00:22] INFO  backup: upload finished in 7.4s
[2026-08-10 03:00:22] WARN  backup: retention exceeded, removing /backups/2026-07-27.sql.gz
[2026-08-10 03:00:23] INFO  backup: 30 snapshots retained, oldest 2026-07-11
[2026-08-10 03:00:23] INFO  cron: job "backup-database" finished with exit code 0`;

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
          <CodeBlock language="log" code={log} copyable />
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
