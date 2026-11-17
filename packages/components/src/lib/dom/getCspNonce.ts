/**
 * Reads the CSP nonce from `<meta property="csp-nonce">`, the convention Vite
 * and others follow. Browsers hide a `nonce` attribute after parsing, so the
 * `nonce` property is read first and `content` serves as the fallback.
 */
export const getCspNonce = (): string | undefined => {
  if (typeof document === "undefined") {
    return undefined;
  }

  const meta = document.querySelector<HTMLMetaElement>(
    'meta[property="csp-nonce"]',
  );

  return meta?.nonce || meta?.content || undefined;
};
