import * as yup from 'yup';

export const validateParams = async <TParams>(
  params: TParams,
  schema: yup.ObjectSchema<any>
): Promise<void> => {
  try {
    await schema.validate(params, { abortEarly: false });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new Error(`Validation failed: ${error.errors.join(', ')}`);
    }
    throw error;
  }
};

