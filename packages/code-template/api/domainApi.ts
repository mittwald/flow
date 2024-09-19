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

const apiSleep = (): Promise<void> =>
  new Promise((res) => window.setTimeout(res, 750));

interface Request {
  pagination?: {
    limit: number;
    skip: number;
  };
  filter?: {
    types?: string[];
  };
  search?: string;
}

interface Response {
  data: Domain[];
  totalCount: number;
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

export const getDomains = async (req: Request): Promise<Response> => {
  await apiSleep();

  const types = req.filter?.types;
  const searchString = req.search;

  const preFilteredData = domains.filter((u) => {
    const filterMatches =
      !types || types.length === 0 || types.includes(u.type);
    const searchMatches =
      searchString === undefined ||
      u.domain.toLowerCase().includes(searchString.toLowerCase());
    return filterMatches && searchMatches;
  });

  const totalCount = preFilteredData.length;

  return {
    data: req.pagination
      ? preFilteredData.slice(
          req.pagination.skip,
          req.pagination.skip + req.pagination.limit,
        )
      : preFilteredData,
    totalCount,
  };
};

export const getDomain = (id: string): Domain => {
  const domain = domains.find((d) => d.id === id);

  if (!domain) {
    throw new Error("Domain not found");
  }

  return domain;
};

export const types = domains
  .map((d) => d.type)
  .filter((v, i, a) => a.indexOf(v) === i);

export const loadDomains = async () => {
  const response = await getDomains({});

  return {
    data: response.data,
    itemTotalCount: response.totalCount,
  };
};
