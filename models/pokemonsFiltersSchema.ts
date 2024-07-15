import * as yup from 'yup';

export const pokemonsFiltersSchema = yup
  .object()
  .shape({
    id: yup.array().of(yup.number().required()).required(),
    type: yup.string().required(),
  })
  .required();
