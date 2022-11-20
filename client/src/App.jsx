import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { pagewrap } from './styles/components/App.module.scss'
import Footer from './components/Footer';
import ProductList from './components/ProductList';
import Header from './components/header/Header';
import Home from './components/home/Home';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Profile from './components/profile/Profile';
import Product from './components/product/Product';
import './styles/styles.scss';

export default function App() {
  return (
    <div>
      <div className={pagewrap}>
        <UserProvider>
          <BrowserRouter>
            <Header />
            <Routes>
              <Route exact path='/' element={ <Home /> } />
              <Route path='/login' element={ <Login /> } />
              <Route path='/register' element={ <Register /> } />
              <Route path='/user/:id/*' element={ <Profile /> } />
              {['movies', 'shows', 'books'].map(type => (
                <Route path={`/${type}`} element={ <ProductList type={type} /> } />
              ))}
              {['movie', 'show', 'book'].map(type => (
                <Route path={`/${type}/:id/*`} element={ <Product type={type} /> } />
              ))}
            </Routes>
          </BrowserRouter>
        </UserProvider>
      </div>
      <Footer />
    </div>
  );
};
