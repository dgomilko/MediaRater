import React from 'react';
import NavbarLink from './NavbarLink';
import { types } from '../../utils/productTypes';

export default function Navbar() {
  return (
    <div>
      {types.map(p =>
        <NavbarLink page={`${p[0].toUpperCase() + p.slice(1)}s`} />
      )}
    </div>
  );
}
