import * as yup from 'yup';

export const queryParamsSchema = yup
  .object({
    id: yup.array().of(yup.number().required()).required(),
    type: yup.string().notRequired(),
  })
  .test('max-one-type', 'Type parameter must appear at most once', (value) => {
    const { type } = value || {};
    return (
      typeof type === 'undefined' ||
      (typeof type === 'string' && !Array.isArray(type))
    );
  });

export type QueryParams = yup.InferType<typeof queryParamsSchema>;
