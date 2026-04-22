export const withRouteParams = (template: string, params: Record<string, string>) => {
  let result = template;
  for (const [key, value] of Object.entries(params)) {
    result = result.replaceAll(`{${key}}`, encodeURIComponent(value));
  }
  return result;
};

export const withQueryParams = (
  url: string,
  params: Record<string, string | number | boolean | null | undefined>,
) => {
  const entries = Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '');
  if (entries.length === 0) return url;
  const query = entries
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
  return url.includes('?') ? `${url}&${query}` : `${url}?${query}`;
};
