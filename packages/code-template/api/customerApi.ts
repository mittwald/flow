export interface ContractPartner {
  firstName: string;
  lastName: string;
  street: string;
  houseNumber: string;
  zip: string;
  city: string;
  country: string;
  email: string;
  phone?: string;
}

export interface InvoiceSettings {
  type: string;
  firstName: string;
  lastName: string;
  street: string;
  houseNumber: string;
  zip: string;
  city: string;
  country: string;
  email: string;
  phone?: string;
}

export interface Customer {
  id: string;
  name: string;
  contractPartner: ContractPartner;
  invoiceSettings: InvoiceSettings;
}

export const customer: Customer = {
  id: "1",
  name: "Agentur Schmidt",
  contractPartner: {
    firstName: "Franz",
    lastName: "Müller",
    street: "Jackenweg",
    houseNumber: "44a",
    zip: "12893",
    city: "Lanzhausen",
    country: "Deutschland",
    email: "f.mueller@mittwald.de",
    phone: "+49 172 12345678",
  },
  invoiceSettings: {
    type: "Rechnung",
    firstName: "Franz",
    lastName: "Müller",
    street: "Jackenweg",
    houseNumber: "44a",
    zip: "12893",
    city: "Lanzhausen",
    country: "Deutschland",
    email: "f.mueller@mittwald.de",
    phone: "+49 172 12345678",
  },
};

export const getCustomer = (): Customer => {
  return customer;
};
