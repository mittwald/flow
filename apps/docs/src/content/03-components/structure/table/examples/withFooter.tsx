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
    <TableColumn>Preis</TableColumn>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>proSpace (2 vCPU / 4 GB RAM)</TableCell>
      <TableCell>32,00 €</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>20 GB Speicherplatz</TableCell>
      <TableCell>Inklusive</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>20 GB Zusatzspeicherplatz</TableCell>
      <TableCell>2,00 €</TableCell>
    </TableRow>
    <TableFooterRow>
      <TableCell>Gesamtpreis</TableCell>
      <TableCell>34,00 €</TableCell>
    </TableFooterRow>
  </TableBody>
</Table>;
