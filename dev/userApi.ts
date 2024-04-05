export type Domain = (typeof domains)[number];

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

export const domains = [
  {
    hostname: "my-domain.de",
    domain: "my-domain.de",
    type: "domain",
    verified: true,
  },
  {
    hostname: "www.my-domain.de",
    domain: "my-domain.de",
    type: "subdomain",
    verified: true,
  },
  {
    hostname: "blog.my-domain.de",
    domain: "my-domain.de",
    type: "subdomain",
    verified: true,
  },
  {
    hostname: "another-domain.de",
    domain: "another-domain.de",
    type: "domain",
    verified: false,
  },
  {
    hostname: "one-more-domain.com",
    domain: "one-more-domain.com",
    type: "domain",
    verified: true,
  },
  {
    hostname: "www.one-more-domain.com",
    domain: "one-more-domain.com",
    type: "subdomain",
    verified: true,
  },
  {
    hostname: "shop.one-more-domain.com",
    domain: "one-more-domain.com",
    type: "subdomain",
    verified: true,
  },
];

export const types = domains
  .map((d) => d.type)
  .filter((v, i, a) => a.indexOf(v) === i);
