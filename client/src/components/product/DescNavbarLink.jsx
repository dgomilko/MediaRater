import React from 'react';
import { Link } from 'react-router-dom';
import {
  descLink,
  descLinkSelected
} from '../../styles/components/product/DescNavbarLink.module.scss';

export default function NavbarLink({ page, title, selected }) {
  return <Link className={selected ? descLinkSelected : descLink} to={`${page}`}>{title}</Link>;
};
