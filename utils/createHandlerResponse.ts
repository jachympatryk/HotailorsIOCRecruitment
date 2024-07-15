import { HttpResponseInit } from '@azure/functions';

export const createHandlerResponse = <T>(
  status: number,
  body: T
): HttpResponseInit => {
  return {
    status,
    body: JSON.stringify(body),
  };
};
