import { type ChangeEvent, useCallback, useState } from 'react';

interface UseFormProps<T> {
  values: T;
  errors: { [K in keyof T]?: string | undefined };
  isValid: boolean;
  onChange: (e: React.ChangeEvent<any>) => void;
  resetForm: (values?: T) => void;
}

export const useForm = <T>(initialValues: T): UseFormProps<T> => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<{ [K in keyof T]?: string | undefined }>({});
  const [isValid, setIsValid] = useState(false);

  const onChange = ({ target }: ChangeEvent<HTMLInputElement>): void => {
    const { value, name, validationMessage } = target;
    setValues({ ...values, [name]: value });
    setErrors({ ...errors, [name]: validationMessage ?? '' });
    setIsValid(target.closest('form')?.checkValidity() ?? false);
  };

  const resetForm = useCallback((newValues: T = initialValues) => {
    setValues({ ...initialValues, ...newValues });
    setErrors({});
    setIsValid(false);
  }, []);

  return { values, errors, isValid, onChange, resetForm };
};
