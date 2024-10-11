export interface Invoice {
  name: string;
  date: string;
  amount: string;
}

export const invoices: Invoice[] = [
  { name: "RG100534", date: "03.09.2024", amount: "15 €" },
  { name: "RG100533", date: "01.09.2024", amount: "25 €" },
  { name: "RG100532", date: "01.08.2024", amount: "25 €" },
  { name: "RG100531", date: "23.07.2024", amount: "18 €" },
  { name: "RG100530", date: "01.07.2024", amount: "25 €" },
];

export const listInvoices = (): Invoice[] => {
  return invoices;
};
