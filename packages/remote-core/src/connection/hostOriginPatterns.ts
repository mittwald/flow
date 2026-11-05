interface ParsedOrigin {
  origin: string;
  protocol: string;
  hostname: string;
  port: string;
}

interface WildcardOriginPattern {
  protocol: string;
  hostname: string;
  port: string;
}

const WILDCARD_LABEL = "wildcard";
const WILDCARD_PATTERN =
  /^([a-zA-Z][a-zA-Z\d+.-]*):\/\/\*\.([^/:?#\\@]+)(?::(\d+))?$/;

const parseOrigin = (value: string): ParsedOrigin | undefined => {
  try {
    const url = new URL(value);
    if (url.origin === "null") {
      return undefined;
    }

    return {
      origin: url.origin,
      protocol: url.protocol,
      hostname: url.hostname.toLowerCase(),
      port: url.port,
    };
  } catch {
    return undefined;
  }
};

const parseWildcardPattern = (
  value: string,
): WildcardOriginPattern | undefined => {
  if (value !== value.trim()) {
    return undefined;
  }

  const match = WILDCARD_PATTERN.exec(value);
  if (!match) {
    return undefined;
  }

  const [, scheme, domain, port] = match;
  if (!scheme || !domain) {
    return undefined;
  }

  try {
    const url = new URL(
      `${scheme}://${WILDCARD_LABEL}.${domain}${port ? `:${port}` : ""}`,
    );
    const hostnamePrefix = `${WILDCARD_LABEL}.`;

    if (
      url.origin === "null" ||
      url.username ||
      url.password ||
      !url.hostname.toLowerCase().startsWith(hostnamePrefix)
    ) {
      return undefined;
    }

    const hostname = url.hostname.toLowerCase().slice(hostnamePrefix.length);
    if (!hostname || hostname.includes("*")) {
      return undefined;
    }

    return {
      protocol: url.protocol,
      hostname,
      port: url.port,
    };
  } catch {
    return undefined;
  }
};

const matchesWildcardPattern = (
  candidate: ParsedOrigin,
  pattern: WildcardOriginPattern,
): boolean => {
  if (
    candidate.protocol !== pattern.protocol ||
    candidate.port !== pattern.port
  ) {
    return false;
  }

  const hostnameSuffix = `.${pattern.hostname}`;
  if (!candidate.hostname.endsWith(hostnameSuffix)) {
    return false;
  }

  const subdomain = candidate.hostname.slice(0, -hostnameSuffix.length);
  return subdomain.split(".").every((label) => label.length > 0);
};

/** Normalizes a non-opaque host origin. */
export const normalizeHostOrigin = (value: string): string | undefined =>
  parseOrigin(value)?.origin;

/** Creates a matcher for exact and wildcard allowed host origins. */
export const createAllowedHostOriginMatcher = (
  allowedHostOrigins: readonly string[],
) => {
  const exactOrigins = new Set<string>();
  const wildcardPatterns: WildcardOriginPattern[] = [];

  for (const value of allowedHostOrigins) {
    if (value.includes("*")) {
      const pattern = parseWildcardPattern(value);
      if (pattern) {
        wildcardPatterns.push(pattern);
      }
      continue;
    }

    const origin = normalizeHostOrigin(value);
    if (origin) {
      exactOrigins.add(origin);
    }
  }

  return (candidateOrigin: string): boolean => {
    const candidate = parseOrigin(candidateOrigin);
    if (!candidate) {
      return false;
    }

    if (exactOrigins.has(candidate.origin)) {
      return true;
    }

    return wildcardPatterns.some((pattern) =>
      matchesWildcardPattern(candidate, pattern),
    );
  };
};
