import React from 'react';
import NavbarLink from './NavbarLink';
import { types } from '../../utils/productTypes';

export default function Navbar() {
  return (
    <div>
      {types.map(p =>
        <NavbarLink page={`${p}s`} />
      )}
    </div>
  );
}
