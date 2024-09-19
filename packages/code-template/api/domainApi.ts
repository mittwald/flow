export interface DomainOwner {
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

export interface Domain {
  id: string;
  hostname: string;
  domain: string;
  type: "Domain" | "Subdomain" | "Default-Domain";
  ssl?: string;
  owner: DomainOwner;
}

export const domains: Domain[] = [
  {
    id: "1",
    hostname: "toujours.de",
    domain: "toujours.de",
    type: "Domain",
    ssl: "Let’s Encrypt",
    owner: {
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
  },
  {
    id: "2",
    hostname: "www.toujours.de",
    domain: "toujours.de",
    type: "Subdomain",
    ssl: "Let’s Encrypt",
    owner: {
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
  },
  {
    id: "3",
    hostname: "p-lis5uw.project.space",
    domain: "project.space",
    type: "Default-Domain",
    ssl: "Let’s Encrypt",
    owner: {
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
  },
  {
    id: "4",
    hostname: "example.de",
    domain: "example.de",
    type: "Domain",
    owner: {
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
  },
  {
    id: "5",
    hostname: "www.example.de",
    domain: "example.de",
    type: "Subdomain",
    ssl: "Let’s Encrypt",
    owner: {
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
  },
  {
    id: "6",
    hostname: "blog.example.de",
    domain: "example.de",
    type: "Subdomain",
    ssl: "Let’s Encrypt",
    owner: {
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
  },
];

export const listDomains = (): Domain[] => {
  return domains;
};

export const getDomain = (id: string): Domain => {
  const domain = domains.find((d) => d.id === id);

  if (!domain) {
    throw new Error("Domain not found");
  }

  return domain;
};
