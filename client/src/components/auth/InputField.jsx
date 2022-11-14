import React from 'react';
import {
  fieldWrapper,
  inputField,
  warningWrapper,
  inputWarning
} from '../../styles/components/auth/InputField.module.scss';


export default function InputField({ type, label, onChange, warning }) {
  return (
    <div className={fieldWrapper}>
      <p>{ label }:</p>
      <input
        className={warning ? inputWarning : inputField}
        spellCheck='false' {...{ type, onChange} }
      />
      <div className={warningWrapper}>
        <span>{warning}</span>
      </div>
    </div>
  );
};
