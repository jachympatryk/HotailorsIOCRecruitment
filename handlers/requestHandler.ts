import {
  HttpHandler,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import { Container } from 'inversify';
import * as yup from 'yup';
import getContainer, { useLogger } from '../ioc/inversify.config';
import { createHandlerResponse, validateParams } from '../utils';
import { HTTP_STATUS } from '../constants/constants';

type FetchDataFunction<TParams, TResponse> = (
  params: TParams,
  container: Container
) => Promise<TResponse>;
type ParseParamsFunction<TParams> = (url: string) => TParams;

export const createRequestHandler = <TParams, TResponse>(
  fetchData: FetchDataFunction<TParams, TResponse>,
  parseParams: ParseParamsFunction<TParams>,
  schema?: yup.ObjectSchema<any>
): HttpHandler => {
  return async (
    req: HttpRequest,
    ctx: InvocationContext
  ): Promise<HttpResponseInit> => {
    const container: Container = getContainer();
    const logger = useLogger(ctx, 'generic-handler');

    logger.info('Request received.');

    try {
      const parsedParams: TParams = parseParams(req.url);

      if (schema) {
        await validateParams(parsedParams, schema);
      }

      logger.info(`Parsed parameters: ${JSON.stringify(parsedParams)}`);

      const data: TResponse = await fetchData(parsedParams, container);

      return createHandlerResponse(HTTP_STATUS.OK, data);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        logger.error(`Validation error: ${error.errors.join(', ')}`);
        return createHandlerResponse(HTTP_STATUS.BAD_REQUEST, {
          error: `Validation failed: ${error.errors.join(', ')}`,
        });
      }
      if (error instanceof Error) {
        logger.error(`Error processing request: ${error.message}`);
        return createHandlerResponse(HTTP_STATUS.BAD_REQUEST, {
          error: error.message,
        });
      }
      logger.error('Unknown error processing request');
      return createHandlerResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, {
        error: 'Internal Server Error',
      });
    }
  };
};
