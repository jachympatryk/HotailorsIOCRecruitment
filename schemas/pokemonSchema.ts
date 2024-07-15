import * as yup from 'yup';
import { Pokemon } from '../models';

export const pokemonSchema: yup.ObjectSchema<Pokemon> = yup
  .object({
    id: yup.number().required(),
    name: yup.string().required(),
    types: yup
      .array()
      .of(
        yup.object({
          slot: yup.number().required(),
          type: yup
            .object({
              name: yup.string().required(),
              url: yup.string().required(),
            })
            .required(),
        })
      )
      .required(),
  })
  .required();
