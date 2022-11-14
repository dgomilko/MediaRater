import React from 'react';
import Navbar from './Navbar';
import AuthOptions from './AuthOptions';
import { Link } from 'react-router-dom';
import { header, title, navWrapper } from '../../styles/components/Header.module.scss';
import { items } from '../../styles/components/NavbarLink.module.scss';

export default function Header() {
  return (
    <header className={header}>
      <div className={navWrapper}>
        <Link className={items} to='/'>
          <h1 className={title}>MediaRater</h1>
        </Link>
        <Navbar />
      </div>
      <AuthOptions />
    </header>
  );
}
