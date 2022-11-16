import React from 'react';
import DescNavbarLink from './DescNavbarLink';
import { useLocation } from 'react-router-dom';
import {
  navbarWrapper
} from '../../styles/components/product/ProductNavbar.module.scss';

export default function ProductNavbar() {
  const location = useLocation();
  const path = location.pathname.split('/')[3];
  return (
    <div className={navbarWrapper}>
      <DescNavbarLink selected={!path} title='Reviews' page='' />
      <DescNavbarLink selected={path === 'stats'} title='Stats' page='stats' />
    </div>
  );
};
