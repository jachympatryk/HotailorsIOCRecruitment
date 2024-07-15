import { parseQueryParams } from './parseQueryParams';

export type QueryParams = {
  id: number[];
  type?: string;
};

export const getParsedParams = (url: string): QueryParams => {
  const [, queryParams = ''] = url.split('?');
  const parsedParams = parseQueryParams(queryParams) as Record<string, unknown>;

  const idParam = parsedParams.id;
  const typeParam = parsedParams.type;

  const ids = Array.isArray(idParam)
    ? Array.from(new Set(idParam.map((id) => Number(id))))
    : [Number(idParam)];

  const type = Array.isArray(typeParam)
    ? (typeParam[0] as string)
    : (typeParam as string);

  return {
    id: ids,
    type,
  };
};
