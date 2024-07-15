import 'reflect-metadata';
import { Container } from 'inversify';
import { InvocationContext } from '@azure/functions';
import HttpClient from '../api/httpClient';
import { PokemonApi } from '../api';
import { ILogger } from '../commonServices/ILogger';
import { Logger } from '../commonServices/Logger';
import { COMMON_TYPES } from './commonTypes';

const getContainer: () => Container = (): Container => {
  const container: Container = new Container();

  container
    .bind<HttpClient>(COMMON_TYPES.HttpClient)
    .to(HttpClient)
    .inSingletonScope();

  container
    .bind<PokemonApi>(COMMON_TYPES.PokemonApi)
    .to(PokemonApi)
    .inSingletonScope();

  container.bind<ILogger>(COMMON_TYPES.ILogger).to(Logger).inSingletonScope();

  return container;
};

export const useLogger = (
  ctx: InvocationContext,
  processId: string
): ILogger => {
  const container: Container = getContainer();
  const logger: Logger = container.get<ILogger>(COMMON_TYPES.ILogger) as Logger;
  logger.init(ctx, processId);

  return logger;
};

export default getContainer;
