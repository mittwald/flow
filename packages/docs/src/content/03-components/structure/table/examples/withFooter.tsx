import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@mittwald/flow-react-components/Table";

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
    <TableRow footer>
      <TableCell>Gesamtpreis</TableCell>
      <TableCell>34,00 €</TableCell>
    </TableRow>
  </TableBody>
</Table>;
