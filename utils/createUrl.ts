export const createUrl = (
  baseUrl: string,
  endpoint: string,
  queryParams?: Record<string, string>
): string => {
  let url = `${baseUrl}/${endpoint}`;
  if (queryParams) {
    const queryString = new URLSearchParams(queryParams).toString();
    url += `?${queryString}`;
  }
  return url;
};
