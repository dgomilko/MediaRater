import React from 'react';
import DropdownMenu from './DropdownMenu';
import { useLocation } from 'react-router-dom';
import {
  navbarWrapper,
} from '../../styles/components/profile/ProfileNavbar.module.scss'

export default function ProfileNavbar() {
  const products = ['Movies', 'Shows', 'Books'];
  const location = useLocation();
  const path = location.pathname.split('/')[3];
  const selected = path?.split('-')[1];
  
  const menus = [
    ['Reviews', products],
    ['Recommendations', products],
  ];

  return (
    <ul className={navbarWrapper}>
      {menus.map(menu =>
        <DropdownMenu selected={selected} menu={menu} />)
      }
    </ul>
  );
};
