export const parseQueryParams = (queryParams: string): Record<string, any> => {
  return queryParams
    .split('&')
    .reduce((acc: Record<string, any>, param): Record<string, any> => {
      const [key = '', value = ''] = param.split('=');
      const decodedKey = decodeURIComponent(key);
      const decodedValue = decodeURIComponent(value);

      if (acc[decodedKey]) {
        acc[decodedKey] = Array.isArray(acc[decodedKey])
          ? [...(acc[decodedKey] as string[]), decodedValue]
          : [acc[decodedKey], decodedValue];
      } else {
        acc[decodedKey] = decodedValue;
      }

      return acc;
    }, {});
};
