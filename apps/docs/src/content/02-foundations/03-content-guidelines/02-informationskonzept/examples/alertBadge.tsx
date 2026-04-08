import { AlertBadge } from "@mittwald/flow-react-components";

<Row>
  <AlertBadge>Update verfügbar</AlertBadge>

  <AlertBadge status="warning">
    Speicherplatz fast voll
  </AlertBadge>

  <AlertBadge status="danger">
    Speicherplatz voll
  </AlertBadge>

  <AlertBadge status="success">Verifiziert</AlertBadge>

  <AlertBadge status="unavailable">
    Nicht gefunden
  </AlertBadge>
</Row>;
