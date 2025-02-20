import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableFooterRow,
  TableHeader,
  TableRow,
} from "@mittwald/flow-react-components";

<Table aria-label="Bestellübersicht">
  <TableHeader>
    <TableColumn>Artikel</TableColumn>
    <TableColumn horizontalAlign="end">Preis</TableColumn>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>proSpace (2 vCPU / 4 GB RAM)</TableCell>
      <TableCell horizontalAlign="end">32,00 €</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>20 GB Speicherplatz</TableCell>
      <TableCell horizontalAlign="end">Inklusive</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>20 GB Zusatzspeicherplatz</TableCell>
      <TableCell horizontalAlign="end">2,00 €</TableCell>
    </TableRow>
    <TableFooterRow>
      <TableCell>Gesamtpreis</TableCell>
      <TableCell horizontalAlign="end">34,00 €</TableCell>
    </TableFooterRow>
  </TableBody>
</Table>;
