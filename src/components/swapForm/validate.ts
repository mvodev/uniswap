import FormData, { FormKey } from './Types';

const validate = (values: FormData): Record<string, string> => {
  const errors: Record<string, string> = {};
  const REQUIRED_FIELDS: FormKey[] = [
    'fromToken',
    'toToken',
  ];

  REQUIRED_FIELDS.forEach((field) => {
    if (values[field] === undefined) {
      errors[field] = 'This field is required to be filled in';
    }
  });

  return errors;
};

export default validate;
