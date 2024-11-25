export interface Domain {
  id: string;
  hostname: string;
  domain: string;
  type: "Subdomain" | "Domain";
  verified: boolean;
  tld: string;
}

const apiSleep = (): Promise<void> =>
  new Promise((res) => window.setTimeout(res, 750));

export const getTypes = async () => {
  await apiSleep();
  return types;
};

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

export const domains: Domain[] = [
  {
    id: "abc-1",
    hostname: "my-domain.de",
    domain: "my-domain.de",
    type: "Domain",
    verified: true,
    tld: "de",
  },
  {
    id: "abc-2",
    hostname: "www.my-domain.de",
    domain: "my-domain.de",
    type: "Subdomain",
    verified: false,
    tld: "de",
  },
  {
    id: "abc-3",
    hostname: "www.one-more-domain.com",
    domain: "one-more-domain.com",
    type: "Subdomain",
    verified: true,
    tld: "com",
  },
  {
    id: "abc-4",
    hostname: "shop.one-more-domain.com",
    domain: "one-more-domain.com",
    type: "Subdomain",
    verified: true,
    tld: "com",
  },
  {
    id: "abc-5",
    hostname: "blog.my-domain.de",
    domain: "my-domain.de",
    type: "Subdomain",
    verified: true,
    tld: "de",
  },
  {
    id: "abc-6",
    hostname: "another-domain.de",
    domain: "another-domain.de",
    type: "Domain",
    verified: false,
    tld: "de",
  },
  {
    id: "abc-7",
    hostname: "one-more-domain.com",
    domain: "one-more-domain.com",
    type: "Domain",
    verified: true,
    tld: "com",
  },
];

export const types = domains
  .map((d) => d.type)
  .filter((v, i, a) => a.indexOf(v) === i);
