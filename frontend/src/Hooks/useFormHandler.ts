import { useState } from "react";

type FormData = Record<string, string>;

interface UseFormHandlerProps<T extends FormData> {
  initialValues: T;
  onSubmit?: (values: T) => Promise<void>;
  validate?: (values: T) => string | null;
}

export const useFormHandler = <T extends FormData>({
  initialValues,
  onSubmit,
  validate,
}: UseFormHandlerProps<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validate) {
      const errorMessage = validate(values);
      if (errorMessage) {
        return Promise.reject(errorMessage);
      }
    }

    if (onSubmit) {
      try {
        setIsSubmitting(true);
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return {
    values,
    setValues,
    handleChange,
    handleSubmit,
    isSubmitting,
  };
};
