import { inject, injectable } from 'inversify';
import _ from 'lodash';
import { API_URL } from '../config/config';
import { createUrl } from '../utils/createUrl';
import { Pokemon, PokemonResponse } from '../models';
import { pokemonSchema } from '../schemas';
import { COMMON_TYPES } from '../ioc/commonTypes';
import HttpClient from './httpClient';

@injectable()
export class PokemonApi {
  private readonly _apiUrl: string = API_URL;

  @inject(COMMON_TYPES.HttpClient) private readonly _httpClient: HttpClient;

  public async getPokemonById(id: number): Promise<Pokemon> {
    try {
      const endpointUrl = createUrl(this._apiUrl, `pokemon/${id}`);
      return await this._httpClient.getWithSchema<Pokemon>(
        endpointUrl,
        pokemonSchema
      );
    } catch (error) {
      console.error(`Failed to fetch Pokemon with ID ${id}:`, error);
      throw new Error(`Failed to fetch Pokemon with ID ${id}`);
    }
  }

  public async getPokemons(queryParams: {
    id: number[];
    type: string;
  }): Promise<PokemonResponse> {
    const { id, type } = queryParams;

    try {
      const pokemonDataPromises = id.map(this.getPokemonById.bind(this));
      const pokemonDataResponses = await Promise.all(pokemonDataPromises);
      const filteredPokemons = this.filterPokemonsByType(
        pokemonDataResponses,
        type
      );

      return {
        pokemons: _.map(filteredPokemons, 'name'),
      };
    } catch (error) {
      console.error('Failed to fetch Pokemons:', error);
      throw new Error('Failed to fetch Pokemons');
    }
  }

  private filterPokemonsByType(pokemons: Pokemon[], type?: string): Pokemon[] {
    if (!type) return pokemons;
    return _.filter(pokemons, (pokemon) =>
      _.some(pokemon.types, (pokemonType) => pokemonType.type.name === type)
    );
  }
}
