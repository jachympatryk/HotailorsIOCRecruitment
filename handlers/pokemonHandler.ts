import { HttpHandler } from '@azure/functions';
import { Container } from 'inversify';
import { PokemonApi } from '../api';
import { COMMON_TYPES } from '../ioc/commonTypes';
import { getParsedParams, QueryParams } from '../utils';
import { queryParamsSchema } from '../schemas';
import { PokemonResponse } from '../models';
import { createRequestHandler } from './requestHandler';

const fetchPokemonData = async (
  params: QueryParams,
  container: Container
): Promise<PokemonResponse> => {
  const pokemonApi: PokemonApi = container.get<PokemonApi>(
    COMMON_TYPES.PokemonApi
  );

  return await pokemonApi.getPokemons({
    id: params.id,
    type: params.type || '',
  });
};

const configurePokemonsHandler = (): HttpHandler => {
  return createRequestHandler<QueryParams, PokemonResponse>(
    fetchPokemonData,
    getParsedParams,
    queryParamsSchema
  );
};

export const pokemonsHandler = configurePokemonsHandler();
