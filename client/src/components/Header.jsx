import React from 'react';
import Navbar from './Navbar';
import { header, title } from '../styles/components/Header.module.scss';

export default function Header() {
  return (
    <header className={header}>
      <h1 className={title}>MediaRater</h1>
      {/* <Navbar /> */}
    </header>
  );
}
