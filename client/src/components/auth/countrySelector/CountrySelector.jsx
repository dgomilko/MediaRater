import React from 'react';
import { countries } from './countries';
import { selector } from '../../../styles/components/auth/CountrySelector.module.scss';

export default function CountrySelector({ label, value, onChange, warning }) {
  return (
    <div>
      <p>{ label }:</p>
      <select value={value} onChange={onChange} className={selector}>
        {countries.map(val => (
          <option value={val}>{val}</option>
        ))}
      </select>
      <span className="warning">{ warning }</span>
    </div>
  );
};
