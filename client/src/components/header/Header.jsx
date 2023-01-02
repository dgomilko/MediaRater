import React from 'react';
import Navbar from './Navbar';
import AccountOptions from './AccountOptions';
import AccLogo from '../profile/AccLogo';
import { Link } from 'react-router-dom';
import { items } from '../../styles/components/header/NavbarLink.module.scss';
import { header, title, navWrapper } from '../../styles/components/header/Header.module.scss';

export default function Header() {
  return (
    <header className={header}>
      <div className={navWrapper}>
        <Link className={items} to='/'>
          <h1 className={title}>MediaRater</h1>
        </Link>
        <Navbar />
      </div>
      <AccountOptions />
    </header>
  );
};
