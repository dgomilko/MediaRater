import React from 'react';

export default function Submitter({ className, val, ctx }) {
  const { errors, data, verifiers } = ctx;
  const errorsFound = !!(Object.keys(errors).length);
  const emptyFields = Object.keys(data).length !==
    Object.keys(verifiers.validations).length;
  const submitImpossible = errorsFound || emptyFields;

  return <input
    className={className}
    type='submit'
    value={val}
    disabled={submitImpossible}
  />;
};
