import React, { useState } from 'react';
import {
  filterWrapper,
  header,
  filters,
} from '../../styles/components/productsList/ExpandableOptions.module.scss';

export default function ExpandableOptions({ children, title }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={filterWrapper}>
      <div className={header}>
        <p>{title}</p>
        <span onClick={() => setExpanded(!expanded)}>
          {expanded ? '︽' : '︾'}
        </span>
      </div>
      <div
        className={filters}
        style={{'display': expanded ? 'block' : 'none'}}>
        {children}
      </div>
    </div>
  );
};
