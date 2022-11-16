import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  dropdownItems,
  label
} from '../../styles/components/profile/ProfileNavbar.module.scss';

export default function DropdownMenu({ menu, selected }) {
  const [dropdown, setDropdown] = useState(false);
  let ref = useRef();

  useEffect(() => {
    const handler = e => {
     if (dropdown && ref.current && !ref.current.contains(e.target))
      setDropdown(false);
    };
    const events = ['mousedown', 'touchstart'];
    events.forEach(e => document.addEventListener(e, handler));
    return () => events
      .forEach(e => document.removeEventListener(e, handler));
   }, [dropdown]);

  const page = menu[0];
  const service = page.toLowerCase();
   
  return (
    <li onClick={() => setDropdown(!dropdown)} ref={ref}>
      <p className={service === selected ? label : ''} >
        {page}
      </p>
      <ul style={{ 'display': dropdown ? 'block' : 'none' }}>
        {menu[1].map(type => {
          const product = type
            .slice(0, type.length - 1)
            .toLowerCase();
          return (
            <li>
              <Link className={dropdownItems} to={`${product}-${service}`}>
                <p>{type}</p>
              </Link>
            </li>
            )
        })}
      </ul>
    </li>
  );
};
