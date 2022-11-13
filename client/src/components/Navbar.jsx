import React from 'react';
import { NavLink } from 'react-router-dom';

const NavbarLink = ({ page }) => {
  const title = page.charAt(0).toUpperCase() + page.slice(1);
  return <NavLink to={`/${page}`}>{title}</NavLink>;
};

export default function Navbar() {
  return (
    <div>
      <NavbarLink page='movies' />
      <NavbarLink page='shows' />
      <NavbarLink page='books' />
    </div>
  );
}
