import React from 'react';
import './styles/styles.scss';
import { pagewrap } from './styles/components/App.module.scss'
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './components/Home';
import {Movies, Shows, Books} from './components/ProductList'
import Content from './components/Content';
import { NavLink, BrowserRouter, Route, Routes } from 'react-router-dom';


export default function App() {
  return (
    <div>
      <div className={pagewrap}>
        <Header />
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/shows" element={<Shows />} />
            <Route path="/books" element={<Books />} />
          </Routes>
        </BrowserRouter>
      </div>
      <Footer />
    </div>
  )
}
