import { useState } from 'react';

export default function useFormValidation(verifiersData) {
  const [data, setData] = useState(verifiersData.defaults || {});
  const [errors, setErrors] = useState({});

  const handleChange = key => e => {
    const updated = { ...data, [key]: e.target.value };
    validate(updated);
    setData(updated);
  };

  const validate = (data) => {
    const validations = verifiersData.validations;
    const foundErrors = {};
    for (const key in data) {
      const value = data[key];
      const validation = validations[key];

      const custom = validation.custom;
      if (custom && !custom(value, data)) {
        foundErrors[key] = validation.warning;
        continue;
      }

      const required = validation.required;
      if (required && !value) {
        foundErrors[key] = validation.warning;
        continue;
      }

      const pattern = validation.pattern;
      if (pattern && !RegExp(pattern).test(value)) {
        foundErrors[key] = validation.warning;
      }
    }
    setErrors(foundErrors);
  }
  return { data, errors, setErrors, handleChange };
};
