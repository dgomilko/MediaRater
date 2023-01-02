import React from 'react';
import NavbarLink from './NavbarLink';

export default function AuthOptions() {
  return (
    <div>
      {['login', 'register'].map(p => <NavbarLink page={p} />)}
    </div>
  );
};
