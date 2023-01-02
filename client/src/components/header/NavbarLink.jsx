import React from 'react';
import { Link } from 'react-router-dom';
import { items } from '../../styles/components/header/NavbarLink.module.scss';

export default function NavbarLink({ page }) {
  const title = page.charAt(0).toUpperCase() + page.slice(1);
  return <Link className={items} to={`/${page}`}>{title}</Link>;
};
