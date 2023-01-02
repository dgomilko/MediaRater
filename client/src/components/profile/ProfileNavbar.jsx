import React from 'react';
import DropdownMenu from './DropdownMenu';
import { useLocation } from 'react-router-dom';
import { types } from '../../utils/productTypes';
import {
  navbarWrapper,
} from '../../styles/components/profile/ProfileNavbar.module.scss'

export default function ProfileNavbar({ ownPage }) {
  const products = types.map(t => `${t[0].toUpperCase() + t.slice(1)}s`);
  const location = useLocation();
  const path = location.pathname.split('/')[3];
  const selected = path?.split('-')[1];
  const menus = [['Reviews', products]];

  if (ownPage) menus.push(['Recommendations', products]);

  return (
    <ul className={navbarWrapper}>
      {menus.map(menu =>
        <DropdownMenu selected={selected} menu={menu} />)
      }
    </ul>
  );
};
