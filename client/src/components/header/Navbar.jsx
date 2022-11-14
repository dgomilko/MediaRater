import React from 'react';
import NavbarLink from './NavbarLink';

export default function Navbar() {
  const productTypes = ['movies', 'shows', 'books'];
  return (
    <div>
      {productTypes.map(p => <NavbarLink page={p} />)}
    </div>
  );
}
