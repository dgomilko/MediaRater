import React from 'react';
import ExpandableOptions from './ExpandableOptions';
import {
  filterAndLabel
} from '../../styles/components/productsList/Filters.module.scss';

export default function Sort({ sortOptions, onChange, options }) {
  return (
    <ExpandableOptions title='Sort'>
        {sortOptions.map(op => (
          <div className={filterAndLabel}>
            <span>{op.label}</span>
            <select
              value={Object.keys(op.options)
                .find(k => op.options[k] === options[op.field])}
              onChange={e => onChange(e, op)}
            >
              {Object.keys(op.options).map(val => (
                <option value={val}>{val}</option>
              ))}
            </select>
          </div>
      ))}
    </ExpandableOptions>
  )
};
