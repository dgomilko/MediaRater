import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { pagewrap } from './styles/components/App.module.scss'
import Footer from './components/Footer';
import ProductList from './components/productList/ProductList';
import Header from './components/header/Header';
import Home from './components/home/Home';
import Register from './components/auth/Register';
import ExpirationWrapper from './components/ExpirationWrapper';
import Login from './components/auth/Login';
import Profile from './components/profile/Profile';
import Product from './components/product/Product';
import ErrorWrapper from './components/ErrorWrapper';
import { types } from './utils/productTypes';
import './styles/styles.scss';

export default function App() {
  const routes = {
    '/': Home,
    '/login': Login,
    '/register': Register,
    '/user/:id/*': Profile
  };

  const wrapped = El => <ExpirationWrapper><El /></ExpirationWrapper>;

  return (
    <div>
      <div className={pagewrap}>
        <UserProvider>
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path='*' element={ <ErrorWrapper
                error={{message: "Couldn't find this page"}}
              /> } />
              {Object.entries(routes).map(([path, El]) => (
                <Route path={path} element={wrapped(El)}/>
              ))}
              {types.map(type => (
                <Route path={`/${type}s`} element={
                  <ExpirationWrapper>
                    <ProductList type={`${type}s`} />
                  </ExpirationWrapper> }
                />
              ))}
              {types.map(type => (
                <Route path={`/${type}/:id/*`} element={
                  <ExpirationWrapper>
                    <Product type={type} />
                  </ExpirationWrapper> }
                />
              ))}
            </Routes>
          </BrowserRouter>
        </UserProvider>
      </div>
      <Footer />
    </div>
  );
};
