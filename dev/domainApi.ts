export type Domain = {
  hostname: string;
  domain: string;
  type: "Subdomain" | "Domain";
  verified: boolean;
};

const apiSleep = (): Promise<void> =>
  new Promise((res) => window.setTimeout(res, 500));

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
}

interface Response {
  data: Domain[];
  totalCount: number;
}

export const getDomains = async (req: Request): Promise<Response> => {
  await apiSleep();

  const types = req.filter?.types;

  const preFilteredData =
    types === undefined
      ? domains
      : domains.filter((u) => types.length === 0 || types.includes(u.type));
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
    hostname: "my-domain.de",
    domain: "my-domain.de",
    type: "Domain",
    verified: true,
  },
  {
    hostname: "www.my-domain.de",
    domain: "my-domain.de",
    type: "Subdomain",
    verified: true,
  },
  {
    hostname: "blog.my-domain.de",
    domain: "my-domain.de",
    type: "Subdomain",
    verified: true,
  },
  {
    hostname: "another-domain.de",
    domain: "another-domain.de",
    type: "Domain",
    verified: false,
  },
  {
    hostname: "one-more-domain.com",
    domain: "one-more-domain.com",
    type: "Domain",
    verified: true,
  },
  {
    hostname: "www.one-more-domain.com",
    domain: "one-more-domain.com",
    type: "Subdomain",
    verified: true,
  },
  {
    hostname: "shop.one-more-domain.com",
    domain: "one-more-domain.com",
    type: "Subdomain",
    verified: true,
  },
];

export const types = domains
  .map((d) => d.type)
  .filter((v, i, a) => a.indexOf(v) === i);
