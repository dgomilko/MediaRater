import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { pagewrap } from './styles/components/App.module.scss'
import Footer from './components/Footer';
import ProductList from './components/ProductList';
import Header from './components/header/Header';
import Home from './components/Home';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import './styles/styles.scss';

export default function App() {
  return (
    <div>
      <div className={pagewrap}>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route exact path="/" element={ <Home /> } />
            <Route path="/movies" element={ <ProductList type='movies'/> } />
            <Route path="/shows" element={ <ProductList type='shows'/> } />
            <Route path="/books" element={ <ProductList type='books'/> } />
            <Route path="/login" element={ <Login /> } />
            <Route path="/register" element={ <Register /> } />
          </Routes>
        </BrowserRouter>
      </div>
      <Footer />
    </div>
  )
}
