import { SwapFormData } from '../../store/swapFormStore/Types';
import { FormKey } from './Types';

const validate = (values: SwapFormData): Record<string, string> => {
  const errors: Record<string, string> = {};
  const REQUIRED_FIELDS: FormKey[] = [
    'fromTokenValue',
    'toTokenValue',
    'slippage',
  ];

  const tokenLabelsHasChoosen = values.fromTokenLabel && values.toTokenLabel;
  if (tokenLabelsHasChoosen && values.fromTokenLabel.value === values.toTokenLabel.value) {
    errors.fromTokenLabel = 'Токены совпадают';
    errors.toTokenLabel = 'Токены совпадают';
  }

  if (values.slippage && values.slippage > 50) {
    errors.slippage = 'Проскальзывание не может быть больше 50%';
  }

  REQUIRED_FIELDS.forEach((field) => {
    if (values[field] === undefined) {
      errors[field] = 'Пожалуйста заполните поле';
    }
  });

  return errors;
};

export default validate;
